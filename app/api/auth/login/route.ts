import { users } from "../signup/route"; // use the same in-memory array

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body;

  if (!email || !password) {
    return new Response(JSON.stringify({ error: "Email and password required" }), { status: 400 });
  }

  const user = users.find((u: { email: string; password: string }) => u.email === email && u.password === password);


  if (!user) {
    return new Response(JSON.stringify({ error: "Invalid email or password" }), { status: 401 });
  }

  return new Response(JSON.stringify({ message: "Login successful!" }), { status: 200 });
}
