import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const rawBody = await req.json();
        console.log("rawBody", rawBody);
        const body = {
            res_name: rawBody.res_name,
            booking_number: rawBody.booking_number,
        };

        const backendURL = process.env.NEXT_PUBLIC_BACKEND_PROD_API_URL ?? 'http://localhost:8000';

        const backendRes = await fetch(`${backendURL}/api/guest/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        const raw = await backendRes.json();
        
        /* -------- Si le backend renvoie une erreur -------- */
        if (!backendRes.ok) {
            console.log("raw", raw);
            return NextResponse.json(raw, { status: backendRes.status });
        }

        /* -------- Cas succès : on reformate -------- */
        const { token, booking } = raw;
        const res = NextResponse.json({ token, booking }, { status: 200 });

        // S’il y a un Set-Cookie venant du backend, on le relaie
        const setCookie = backendRes.headers.get('set-cookie');
        if (setCookie) res.headers.set('set-cookie', setCookie);

        return res;
    } catch (err: any) {
        console.error('Proxy login error:', err);
        return NextResponse.json(
            { message: 'Internal proxy error' },
            { status: 500 },
        );
    }
}