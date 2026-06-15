export async function GET() {
  const res = await fetch("https://api.frankfurter.app/currencies");
  const data = await res.json();
  return Response.json(data);
}