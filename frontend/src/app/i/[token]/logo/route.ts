function backendBase() {
  return (process.env.BACKEND_URL || "http://localhost:3001").replace(/\/$/, "");
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const upstream = await fetch(
    `${backendBase()}/api/public/invoices/${encodeURIComponent(token)}/logo`,
    { cache: "no-store" },
  );

  if (!upstream.ok) {
    return new Response(upstream.status === 404 ? "Not found" : "Unable to load logo", {
      status: upstream.status,
    });
  }

  const body = await upstream.arrayBuffer();
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": upstream.headers.get("content-type") || "image/png",
      "Cache-Control": upstream.headers.get("cache-control") || "public, max-age=31536000, immutable",
    },
  });
}
