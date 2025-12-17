import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();

    // Validate required fields
    const {
      clientName,
      clientEmail,
      clientPhone,
      serviceType,
      countryOfResidence,
      preferredDateTime,
      moveTimeframe,
      description,
    } = body;

    if (!clientName || !clientEmail || !clientPhone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Log the received data (replace with actual database save logic)
    console.log("Concierge Request Received:", {
      clientName,
      clientEmail,
      clientPhone,
      serviceType,
      countryOfResidence,
      preferredDateTime,
      moveTimeframe,
      description,
      receivedAt: new Date().toISOString(),
    });

    // TODO: Save to database
    // Example: await db.conciergeRequests.create({ data: body });

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Concierge request submitted successfully",
        data: {
          id: `REQ-${Date.now()}`, // Temporary ID generation
          status: "PENDING",
          submittedAt: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing concierge request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
