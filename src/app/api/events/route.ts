// GET : fetches the list of events
// POST : creates an event
import { NextRequest, NextResponse } from 'next/server';

const backendURL = process.env.NEXT_PUBLIC_BACKEND_PROD_API_URL ?? 'http://localhost:8000';
// const backendURL = process.env.NEXT_PUBLIC_BACKEND_DEV_API_URL ?? 'http://localhost:8000';

export async function GET(req: NextRequest) {
  try {
    const auth = req.headers.get('authorization') ?? '';
    const r = await fetch(`${backendURL}/api/events`, {
      headers: { Authorization: auth },
      next: { revalidate: 0 },
    });
    const data = await r.json();
    return NextResponse.json(data, { status: r.status });
  } catch (e) {
    return NextResponse.json({ message: 'Proxy error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("req", req);
    const auth = req.headers.get('authorization') ?? '';
    const r = await fetch(`${backendURL}/api/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: auth },
      body: JSON.stringify(body),
    });
    const data = await r.json();
    return NextResponse.json(data, { status: r.status });
  } catch {
    return NextResponse.json({ message: 'Proxy error' }, { status: 500 });
  }
}

// Idem (PUT / DELETE) si tu en as besoin plus tard