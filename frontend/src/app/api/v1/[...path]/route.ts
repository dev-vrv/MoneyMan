import { NextResponse, type NextRequest } from "next/server";

function getApiProxyTarget() {
  return (process.env.API_PROXY_TARGET ?? "http://backend:8000").replace(/\/$/, "");
}

function buildTargetUrl(request: NextRequest, path: string[]) {
  const upstreamPath = path.join("/");
  const normalizedPath = upstreamPath.endsWith("/") ? upstreamPath : `${upstreamPath}/`;

  return `${getApiProxyTarget()}/api/v1/${normalizedPath}${request.nextUrl.search}`;
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
  const targetUrl = buildTargetUrl(request, path);
  const hasBody = !["GET", "HEAD"].includes(request.method);

  try {
    const upstreamResponse = await fetch(targetUrl, {
      method: request.method,
      headers: buildRequestHeaders(request),
      body: hasBody ? await request.arrayBuffer() : undefined,
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

    return NextResponse.json(
      { error: message, targetUrl, method: request.method },
      { status: 502 },
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
export const OPTIONS = proxyRequest;
