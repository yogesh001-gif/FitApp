export async function GET() {
  return Response.json({ ok: true, service: 'fitmitra', timestamp: new Date().toISOString() });
}
