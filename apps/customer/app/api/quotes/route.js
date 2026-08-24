export async function POST(request) {
  const upstream = process.env.PRINT_API_URL;
  if (!upstream) return Response.json({ error: 'The merchant ordering service is not configured.' }, { status: 503 });
  const response = await fetch(`${upstream}/v1/quotes`, { method: 'POST', headers: { 'content-type': 'application/json', 'x-qrprint-api-key': process.env.PRINT_API_KEY || '' }, body: await request.text(), cache: 'no-store' });
  return new Response(response.body, { status: response.status, headers: { 'content-type': response.headers.get('content-type') || 'application/json' } });
}
