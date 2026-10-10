const API_HOSTS = [
  "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
];

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ resource: string }> },
) {
  const { resource } = await params;
  if (resource !== "products" && resource !== "categories") {
    return Response.json({ error: "Unknown catalog resource" }, { status: 404 });
  }

  for (const host of API_HOSTS) {
    try {
      const response = await fetch(`${host}/${resource}`, { cache: "no-store" });
      if (response.ok) {
        return new Response(response.body, {
          headers: { "Content-Type": "application/json; charset=utf-8" },
        });
      }
    } catch {
      // Try the alternate API host if this host is unreachable.
    }
  }

  return Response.json(
    { error: "Market data is temporarily unavailable" },
    { status: 502 },
  );
}