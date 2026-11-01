import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const movieId = searchParams.get("movieId");

  if (!movieId) {
    return NextResponse.json({ error: "Movie ID is required" }, { status: 400 });
  }

  try {
    const reviews = await prisma.review.findMany({
      where: { movieId },
      include: {
        user: {
          select: { email: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(reviews);
  } catch (error) {
    console.warn("Failed to fetch reviews from DB:", error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { movieId, rating, comment, guestName } = body || {};

    if (!movieId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    let userId: string;

    if (session && session.user && session.user.id) {
      userId = session.user.id;
    } else {
      // Guest comment mode: find or create a general Guest user in DB
      const cleanGuest = (guestName && typeof guestName === "string" && guestName.trim().length > 0)
        ? guestName.trim().slice(0, 25).replace(/[^a-zA-Z0-9_\-\s]/g, "")
        : "Guest";
      
      const guestEmail = `${cleanGuest.toLowerCase().replace(/\s+/g, "") || "guest"}@visitor.filmologyx.com`;

      let guestUser = await prisma.user.findFirst({
        where: { email: guestEmail },
      });

      if (!guestUser) {
        guestUser = await prisma.user.create({
          data: {
            email: guestEmail,
            password: "guest_no_password_auth_disabled",
            role: "USER",
          },
        });
      }

      userId = guestUser.id;
    }

    const review = await prisma.review.create({
      data: {
        movieId,
        userId,
        rating,
        comment: comment ? String(comment).slice(0, 500) : null,
      },
      include: {
        user: {
          select: { email: true }
        }
      }
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Failed to post review:", error);
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}
