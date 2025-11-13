import { NextRequest, NextResponse } from 'next/server';

const backendURL = process.env.NEXT_PUBLIC_BACKEND_PROD_API_URL ?? 'http://localhost:8000';

// GET : liste des réservations
export async function GET(req: NextRequest) {
  try {
    // Récupère le header d’authentification transmis par le frontend
    const auth = req.headers.get('authorization') ?? '';
    const r = await fetch(`${backendURL}/api/inventories`, {
      headers: { Authorization: auth },
      next: { revalidate: 0 },
    });
    const data = await r.json();
    return NextResponse.json(data, { status: r.status });
  } catch (e) {
    return NextResponse.json({ message: 'Proxy error' }, { status: 500 });
  }
}

// POST : création d’une réservation (exemple, si besoin)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const auth = req.headers.get('authorization') ?? '';
    const r = await fetch(`${backendURL}/api/inventories`, {
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

