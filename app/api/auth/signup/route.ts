export let users: { email: string; password: string }[] = [];

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body;

  if (!email || !password) {
    return new Response(
      JSON.stringify({ error: "Email and password required" }),
      { status: 400 }
    );
  }

  const userExists = users.find((u) => u.email === email);

  if (userExists) {
    return new Response(
      JSON.stringify({ error: "User already exists" }),
      { status: 409 }
    );
  }

  users.push({ email, password });

  return new Response(
    JSON.stringify({ message: "User created successfully" }),
    { status: 201 }
  );
}
