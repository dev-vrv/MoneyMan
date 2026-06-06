#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/docker-compose.yml"
PROJECT_ENV="$ROOT_DIR/.env"
SUPERUSER_EMAIL="${DJANGO_SUPERUSER_EMAIL:-dev.vrv@gmail.com}"
SUPERUSER_PASSWORD="${DJANGO_SUPERUSER_PASSWORD:-ggwp8888}"
RESET_MODE=0
MIGRATION_TARGET_APPS=("users" "common" "app")

if [[ ! -f "$PROJECT_ENV" ]]; then
  echo "Root .env file is missing: $PROJECT_ENV" >&2
  exit 1
fi

while [[ $# -gt 0 ]]; do
  case "$1" in
    --reset)
      RESET_MODE=1
      shift
      ;;
    *)
      echo "Unknown argument: $1" >&2
      echo "Usage: $0 [--reset]" >&2
      exit 1
      ;;
  esac
done

remove_migration_files() {
  local migration_roots=(
    "$ROOT_DIR/backend/users/migrations"
    "$ROOT_DIR/backend/backend/common/migrations"
    "$ROOT_DIR/backend/app/migrations"
    "$ROOT_DIR/backend/ai/migrations"
    "$ROOT_DIR/backend/mails/migrations"
    "$ROOT_DIR/backend/payments/migrations"
    "$ROOT_DIR/backend/subscribes/migrations"
  )

  for dir in "${migration_roots[@]}"; do
    mkdir -p "$dir"
    if [[ ! -f "$dir/__init__.py" ]]; then
      touch "$dir/__init__.py"
    fi
    find "$dir" -maxdepth 1 -type f -name '[0-9][0-9][0-9][0-9]_*.py' -delete
    find "$dir" -maxdepth 1 -type f -name '[0-9][0-9][0-9][0-9]_*.pyc' -delete
    find "$dir" -maxdepth 1 -type d -name '__pycache__' -exec rm -rf {} +
  done
}

run_backend_manage() {
  docker compose -f "$COMPOSE_FILE" run --rm backend python manage.py "$@"
}

if [[ "$RESET_MODE" -eq 1 ]]; then
  echo "Reset mode enabled: removing containers, volumes, and migration files."
  docker compose -f "$COMPOSE_FILE" down -v --remove-orphans
  remove_migration_files
fi

docker compose -f "$COMPOSE_FILE" up -d --build postgres redis
run_backend_manage makemigrations "${MIGRATION_TARGET_APPS[@]}" --noinput
run_backend_manage migrate --noinput
run_backend_manage collectstatic --noinput
run_backend_manage shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); email = \"$SUPERUSER_EMAIL\"; password = \"$SUPERUSER_PASSWORD\"; user, _ = User.objects.get_or_create(email=email, defaults={'username': email, 'email': email}); user.email = email; user.username = user.username or email; user.is_staff = True; user.is_superuser = True; user.is_active = True; user.set_password(password); user.save(); print(f'Superuser ensured: {email}')"
docker compose -f "$COMPOSE_FILE" up -d --build backend celery-worker celery-beat frontend nginx

printf '\nProject is running in debug mode.\n'
printf 'App:   http://localhost\n'
printf 'Admin: http://localhost/admin\n'
printf 'API:   http://localhost/api/v1/health/\n'
