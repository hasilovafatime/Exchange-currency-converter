export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from") || "USD";

  const res = await fetch(`https://api.frankfurter.app/latest?from=${from}`);
  const data = await res.json();
  return Response.json(data);
}