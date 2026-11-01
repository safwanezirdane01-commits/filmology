import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAdSettings } from "@/lib/ads";
import { getAnalyticsSummary } from "@/lib/analytics";
import AdminDashboard from "./AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const movies = await prisma.movie.findMany({
    orderBy: { createdAt: "desc" },
  });

  const adSettings = getAdSettings();
  const analyticsSummary = getAnalyticsSummary();

  return (
    <AdminDashboard
      initialMovies={movies}
      initialAdSettings={adSettings}
      initialAnalytics={analyticsSummary}
    />
  );
}
