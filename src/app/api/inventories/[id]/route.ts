import { NextRequest, NextResponse } from 'next/server';

// const backendURL = process.env.NEXT_PUBLIC_BACKEND_PROD_API_URL ?? 'http://localhost:8000';
const backendURL = process.env.NEXT_PUBLIC_BACKEND_DEV_API_URL ?? 'http://localhost:8000';

type Params = { params: { id: string } };

// GET /api/bookings/:id
export async function GET(req: NextRequest, { params }: Params) {
  try {
    console.log("params", await params)
    console.log("params.id", (await params).id)
    const paramsId = (await params).id;
    const auth = req.headers.get('authorization') ?? '';
    const r = await fetch(`${backendURL}/api/inventories/${paramsId}`, {
      headers: { Authorization: auth },
      next: { revalidate: 0 },
    });

    // Si backend renvoie 204/texte, évite le crash du .json()
    const data = await r.json();
    return NextResponse.json(data, { status: r.status });
  } catch (e) {
    return NextResponse.json({ message: 'Proxy error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
    try {
        const paramsId = (await params).id;
        const body = await req.json();
        const auth = req.headers.get('authorization') ?? '';
        const r = await fetch(`${backendURL}/api/inventories/${paramsId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: auth },
            next: { revalidate: 0 },
            body: JSON.stringify(body),
        });

        // Si backend renvoie 204/texte, évite le crash du .json()
        const data = await r.json();
        return NextResponse.json(data, { status: r.status });
    } catch (e) {
        return NextResponse.json({ message: 'Proxy error' }, { status: 500 });
    }
}

// (Optionnel) DELETE si tu en as besoin plus tard
// export async function DELETE(req: NextRequest, { params }: Params) { ... }