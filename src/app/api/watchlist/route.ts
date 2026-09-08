import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { movieId, action } = await req.json();

    if (!movieId) {
      return NextResponse.json({ message: "Movie ID is required" }, { status: 400 });
    }

    if (action === "add") {
      await prisma.watchlist.create({
        data: {
          userId: session.user.id,
          movieId: movieId,
        },
      });
    } else if (action === "remove") {
      await prisma.watchlist.delete({
        where: {
          userId_movieId: {
            userId: session.user.id,
            movieId: movieId,
          },
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
