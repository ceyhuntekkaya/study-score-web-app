import { NextRequest, NextResponse } from 'next/server';
import { getApiAiUrl, getOllamaPass, getOllamaUser } from '@/config';

export const runtime = 'nodejs';
export const maxDuration = 120;

function buildAuthHeader(): string {
  const token = Buffer.from(`${getOllamaUser()}:${getOllamaPass()}`).toString('base64');
  return `Basic ${token}`;
}

async function proxyToOllama(
  req: NextRequest,
  pathSegments: string[]
): Promise<NextResponse> {
  const targetUrl = `${getApiAiUrl()}/${pathSegments.join('/')}${req.nextUrl.search}`;

  try {
    const headers: HeadersInit = {
      Authorization: buildAuthHeader(),
    };

    const contentType = req.headers.get('content-type');
    if (contentType) {
      headers['Content-Type'] = contentType;
    }

    const init: RequestInit = {
      method: req.method,
      headers,
      cache: 'no-store',
    };

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      init.body = await req.text();
    }

    const upstream = await fetch(targetUrl, init);

    const responseHeaders = new Headers();
    const upstreamContentType = upstream.headers.get('content-type');
    if (upstreamContentType) {
      responseHeaders.set('Content-Type', upstreamContentType);
    }

    return new NextResponse(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Ollama proxy error:', targetUrl, error);
    return NextResponse.json(
      { error: 'Cannot reach Ollama upstream' },
      { status: 502 }
    );
  }
}

type RouteContext = { params: Promise<{ path: string[] }> };

export async function GET(req: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyToOllama(req, path);
}

export async function POST(req: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyToOllama(req, path);
}
