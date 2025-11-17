import { NextRequest, NextResponse } from 'next/server';

// const backendURL = process.env.NEXT_PUBLIC_BACKEND_PROD_API_URL ?? 'http://localhost:8000';
const backendURL = process.env.NEXT_PUBLIC_BACKEND_DEV_API_URL ?? 'http://localhost:8000';

type Params = { params: { booking_id: string } };

export async function GET(req: NextRequest, { params }: Params) {
    try {
        const { booking_id } = await params;
        console.log("booking_id", booking_id);

        const auth = req.headers.get('authorization') ?? '';
        const r = await fetch(`${backendURL}/api/guest/bookings/${booking_id}/orders`, {
            headers: { Authorization: auth },
            cache: 'no-store',
        });
        const data = await r.json().catch(() => ({}));
        return NextResponse.json(data, { status: r.status });
    } catch (e) {
        console.error('Proxy error (GET guest orders):', e);
        return NextResponse.json({ message: 'Proxy error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest, { params }: Params) {
    try {
        console.log("params.booking_id", (await params).booking_id)
        const body = await req.json();
        const paramsId = (await params).booking_id;

        const auth = req.headers.get('authorization') ?? '';
        const r = await fetch(`${backendURL}/api/guest/bookings/${paramsId}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: auth },
            body: JSON.stringify(body),
        });
        const data = await r.json();
        return NextResponse.json(data, { status: r.status });
    } catch {
        return NextResponse.json({ message: 'Proxy errora' }, { status: 500 });
    }
}