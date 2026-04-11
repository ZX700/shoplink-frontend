export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  let url = `${process.env.NEXT_PUBLIC_API_URL}/api/products`;

  if (id) {
    url += `?id=${id}`;
  }

  const res = await fetch(url);
  const data = await res.json();

  return new Response(JSON.stringify(data), {
    status: res.status,
  });
}

export async function POST(req: Request) {
  const body = await req.json();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  const data = await res.json();

  return new Response(JSON.stringify(data), {
    status: res.status,
  });
}