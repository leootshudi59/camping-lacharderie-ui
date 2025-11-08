import { NextRequest, NextResponse } from 'next/server';

const backendURL = process.env.NEXT_PUBLIC_BACKEND_DEV_API_URL ?? 'http://localhost:8000';

type Params = { params: { booking_id: string; inventory_id: string } };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { booking_id, inventory_id } = await params;
    console.log("booking_id", booking_id);
    console.log("inventory_id", inventory_id);

    const auth = req.headers.get('authorization') ?? '';
    const r = await fetch(`${backendURL}/api/guest/bookings/${booking_id}/inventories/${inventory_id}`, {
      headers: { Authorization: auth },
      cache: 'no-store',
      next: { revalidate: 0 },
    });
    const data = await r.json().catch(() => ({}));
    return NextResponse.json(data, { status: r.status });
  } catch {
    return NextResponse.json({ message: 'Proxy error' }, { status: 500 });
  }
}