import { NextResponse, type NextRequest } from "next/server";

function getApiProxyTargets() {
  const configuredTarget = process.env.API_PROXY_TARGET?.trim();
  const fallbacks = [
    "http://127.0.0.1:8000",
    "http://localhost:8000",
    "http://backend:8000",
  ];

  const candidates = configuredTarget
    ? [configuredTarget, ...fallbacks]
    : fallbacks;

  return Array.from(
    new Set(candidates.map((target) => target.replace(/\/$/, ""))),
  );
}

function buildTargetUrl(baseTarget: string, request: NextRequest, path: string[]) {
  const upstreamPath = path.join("/");
  const normalizedPath = upstreamPath.endsWith("/") ? upstreamPath : `${upstreamPath}/`;

  return `${baseTarget}/api/v1/${normalizedPath}${request.nextUrl.search}`;
}

function buildRequestHeaders(request: NextRequest) {
  const headers = new Headers();

  request.headers.forEach((value, key) => {
    if (["host", "connection", "content-length"].includes(key.toLowerCase())) {
      return;
    }

    headers.set(key, value);
  });

  return headers;
}

function buildResponseHeaders(response: Response) {
  const headers = new Headers();

  response.headers.forEach((value, key) => {
    if (["content-encoding", "transfer-encoding", "connection"].includes(key.toLowerCase())) {
      return;
    }

    headers.set(key, value);
  });

  return headers;
}

async function proxyRequest(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  const hasBody = !["GET", "HEAD"].includes(request.method);
  const requestBody = hasBody ? await request.arrayBuffer() : undefined;
  const targets = getApiProxyTargets();
  const errors: string[] = [];

  for (const target of targets) {
    const targetUrl = buildTargetUrl(target, request, path);

    try {
      const upstreamResponse = await fetch(targetUrl, {
        method: request.method,
        headers: buildRequestHeaders(request),
        body: requestBody ? requestBody.slice(0) : undefined,
        cache: "no-store",
        redirect: "manual",
      });

      const responseBody =
        upstreamResponse.status === 204 || upstreamResponse.status === 304
          ? null
          : await upstreamResponse.arrayBuffer();

      return new NextResponse(responseBody, {
        status: upstreamResponse.status,
        headers: buildResponseHeaders(upstreamResponse),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown proxy error";
      errors.push(`${targetUrl} :: ${message}`);
    }
  }

  return NextResponse.json(
    { error: "All proxy targets failed", targets: errors, method: request.method },
    { status: 502 },
  );
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
export const OPTIONS = proxyRequest;
