import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    // Simulate API call, replace with your actual REST API
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_TRAVEL_API}/travel-plan`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      }
    );

    // const res = await fetch("http://localhost:8000", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "Authorization": `Bearer ${process.env.TRAVEL_API_KEY}`,
    //   },
    //   body: JSON.stringify({ prompt }),
    // });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to fetch travel plan' },
      { status: 500 }
    );
  }
}
