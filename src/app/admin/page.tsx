import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { addMovie, deleteMovie } from "./actions";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const movies = await prisma.movie.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Add New Movie</h2>
          <form action={addMovie} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-1">Title</label>
                <input name="title" required className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white" />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Genre</label>
                <input name="genre" required className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white" />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Release Year</label>
                <input name="releaseYear" type="number" required className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white" />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Thumbnail URL</label>
                <input name="thumbnailUrl" type="url" className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white" placeholder="https://..." />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-400 mb-1">Video Stream (MP4 link, Embed URL, or IMDb / TMDb ID)</label>
                <input name="videoUrl" type="text" className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white" placeholder="e.g. tt0816692, 157336, or https://...mp4" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-400 mb-1">Description</label>
                <textarea name="description" required rows={3} className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white" />
              </div>
            </div>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded">
              Add Movie
            </button>
          </form>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">Manage Movies</h2>
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-900 border-b border-gray-700 text-gray-400">
                <th className="p-4">Title</th>
                <th className="p-4">Year</th>
                <th className="p-4">Genre</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">No movies found.</td>
                </tr>
              ) : (
                movies.map(movie => (
                  <tr key={movie.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                    <td className="p-4 font-medium">{movie.title}</td>
                    <td className="p-4 text-gray-400">{movie.releaseYear}</td>
                    <td className="p-4 text-gray-400">{movie.genre}</td>
                    <td className="p-4 text-right">
                      <form action={async () => {
                        "use server";
                        await deleteMovie(movie.id);
                      }}>
                        <button type="submit" className="text-red-500 hover:text-red-400 font-medium">Delete</button>
                      </form>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
