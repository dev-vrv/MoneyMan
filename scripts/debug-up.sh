#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/docker-compose.yml"
PROJECT_ENV="$ROOT_DIR/.env"
SUPERUSER_EMAIL="dev.vrv@gmail.com"
SUPERUSER_PASSWORD="ggwp8888"

if [[ ! -f "$PROJECT_ENV" ]]; then
  echo "Root .env file is missing: $PROJECT_ENV" >&2
  exit 1
fi

docker compose -f "$COMPOSE_FILE" up -d --build postgres redis
docker compose -f "$COMPOSE_FILE" run --rm backend python manage.py migrate
docker compose -f "$COMPOSE_FILE" run --rm backend python manage.py collectstatic --noinput
docker compose -f "$COMPOSE_FILE" run --rm backend python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); email = \"$SUPERUSER_EMAIL\"; password = \"$SUPERUSER_PASSWORD\"; user, _ = User.objects.get_or_create(email=email, defaults={'username': email, 'email': email}); user.email = email; user.is_staff = True; user.is_superuser = True; user.set_password(password); user.save(); print(f'Superuser ensured: {email}')"
docker compose -f "$COMPOSE_FILE" up -d --build backend celery-worker celery-beat frontend nginx

printf '\nProject is running in debug mode.\n'
printf 'App:   http://localhost\n'
printf 'Admin: http://localhost/admin\n'
printf 'API:   http://localhost/api/v1/health/\n'
