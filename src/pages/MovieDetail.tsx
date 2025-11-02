import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMovies, type Movie } from "../services/movies";
import Player from "../components/Player";
import favSvc from "../services/favorites";
import Comments from "../components/Comments";
import StarRating from "../components/StarRating";

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // 🔹 Obtener todas las películas
        const movies = await getMovies();
        const found = movies.find((m: any) => m._id === id || m.id === id);
        setMovie(found || null);

        // 🔹 Obtener favoritos
        const favs = await favSvc.getFavorites();
        const favIds = favs.map((f) => f.movieId);
        setIsFav(favIds.includes(id || ""));
      } catch (err) {
        console.error("Error cargando detalles de película:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const toggleFavorite = async () => {
    if (!movie) return;
    try {
      const movieId = movie._id || movie.id;
      if (isFav) {
        await favSvc.removeFavorite(movieId);
        setIsFav(false);
      } else {
        await favSvc.addFavorite({
          movieId,
          title: movie.title,
          year: movie.year,
          posterUrl: movie.posterUrl,
          videoUrl: movie.videoUrl,
        });
        setIsFav(true);
      }
    } catch (e) {
      console.error("Error al actualizar favoritos", e);
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Cargando...</p>;
  if (!movie) return <p style={{ textAlign: "center" }}>Película no encontrada.</p>;

  return (
    <div className="text-white bg-slate-900 p-6 rounded-2xl max-w-6xl mx-auto mt-10 shadow-lg">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row gap-8">
        <img
          src={movie.posterUrl || "https://via.placeholder.com/260x380?text=Sin+Poster"}
          alt={movie.title}
          className="w-64 h-auto rounded-xl shadow-lg"
        />
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
          <p className="text-gray-400 mb-2">Año: {movie.year}</p>
          <p className="text-gray-300 mb-4">
            {movie.description ||
              "Una historia cautivadora llena de emociones, drama y acción que te atrapará de principio a fin."}
          </p>

          <button
            onClick={toggleFavorite}
            className={`px-5 py-2 rounded-lg text-white font-semibold transition ${
              isFav ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isFav ? "❤️ Quitar de favoritos" : "🤍 Agregar a favoritos"}
          </button>

          {/* ⭐ Calificación */}
          <div className="mt-6">
            <h2 className="text-lg mb-2">Tu Calificación:</h2>
            <StarRating movieId={movie._id || movie.id} />
          </div>
        </div>
      </div>

      {/* 🎬 PLAYER */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Reproductor</h2>
        <Player movieId={movie._id || movie.id} videoUrl={movie.videoUrl} />
      </div>

      {/* 💬 COMENTARIOS */}
      <div className="mt-10">
        <Comments movieId={movie._id || movie.id} />
      </div>
    </div>
  );
}
