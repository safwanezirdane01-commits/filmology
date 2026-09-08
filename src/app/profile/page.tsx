import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Film } from "lucide-react";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const watchlists = await prisma.watchlist.findMany({
    where: { userId: session.user.id },
    include: { movie: true },
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-gray-400">Email: {session.user.email}</p>
          <p className="text-gray-400">Role: <span className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded text-sm font-semibold">{session.user.role}</span></p>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">My Watchlist</h2>
        {watchlists.length === 0 ? (
          <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 text-center text-gray-400">
            Your watchlist is empty. Go find some movies!
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {watchlists.map((item) => (
              <Link href={`/movie/${item.movie.id}`} key={item.id} className="group">
                <div className="aspect-[2/3] bg-gray-800 rounded-lg overflow-hidden border border-gray-700 mb-2 relative group-hover:border-blue-500 transition-colors">
                  {item.movie.thumbnailUrl ? (
                    <img src={item.movie.thumbnailUrl} alt={item.movie.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                      <Film className="w-10 h-10 text-gray-600 mb-2" />
                      <span className="text-gray-500 text-sm">{item.movie.title}</span>
                    </div>
                  )}
                </div>
                <h3 className="font-medium text-white group-hover:text-blue-400 transition-colors truncate">
                  {item.movie.title}
                </h3>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
