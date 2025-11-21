import { NextRequest, NextResponse } from 'next/server';

const backendURL = process.env.NEXT_PUBLIC_BACKEND_PROD_API_URL ?? 'http://localhost:8000';
// const backendURL = process.env.NEXT_PUBLIC_BACKEND_DEV_API_URL ?? 'http://localhost:8000';

// GET : liste des commandes
export async function GET(req: NextRequest) {
  try {
    // Récupère le header d’authentification transmis par le frontend
    const auth = req.headers.get('authorization') ?? '';
    const r = await fetch(`${backendURL}/api/guest/products`, {
      headers: { Authorization: auth },
      next: { revalidate: 0 },
    });
    const data = await r.json();
    return NextResponse.json(data, { status: r.status });
  } catch (e) {
    return NextResponse.json({ message: 'Proxy error' }, { status: 500 });
  }
}