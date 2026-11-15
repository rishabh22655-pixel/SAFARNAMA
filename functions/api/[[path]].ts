const API_ORIGIN = 'https://safarnama-tvjn.onrender.com';

interface PagesFunctionContext {
  request: Request;
}

export async function onRequest({ request }: PagesFunctionContext): Promise<Response> {
  const incomingUrl = new URL(request.url);
  const upstreamUrl = new URL(`${incomingUrl.pathname}${incomingUrl.search}`, API_ORIGIN);
  return fetch(new Request(upstreamUrl, request));
}
