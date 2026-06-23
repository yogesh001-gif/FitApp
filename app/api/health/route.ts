export async function GET() {
  return Response.json({ ok: true, service: 'fitapp', timestamp: new Date().toISOString() });
}
