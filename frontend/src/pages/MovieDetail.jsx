import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const API = import.meta.env.VITE_API_BASE_URL;

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    fetch(`${API}/movies/${id}`)
      .then((res) => res.json())
      .then(setMovie)
      .catch(console.error);
  }, [id]);

  if (!movie) return null;

  return (
    <div className="bg-black text-white min-h-screen">
      {/* HERO SECTION */}
      <section className="min-h-screen flex items-end overflow-hidden">
        {/* BACKDROP IMAGE */}
        <img
          src={`${API}/movies/${id}/backdrop`}
          alt={movie.title}
          className="
            w-full h-full
            object-cover object-bottom
            absolute inset-0
            pointer-events-none
          "
        />

        {/* OVERLAY */}
        <div
          className="
            absolute inset-0
            bg-gradient-to-t
            from-black via-black/50 to-black/10
          "
        />

        {/* CONTENT */}
        <div
          className="
            relative z-10
            flex flex-col justify-end
            min-h-screen
            px-4 py-6 sm:px-6 md:px-12
            max-w-4xl
          "
        >
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold">
            {movie.title}
          </h1>

          {/* IMDb INFO (same style, subtle, Netflix-like) */}
          {movie.imdb && (
            <div className="mt-3 text-sm text-gray-300 flex flex-wrap gap-3">
              {movie.imdb.rating && (
                <span>
                  ⭐ <span className="font-semibold text-white">{movie.imdb.rating}</span> IMDb
                </span>
              )}

              {movie.imdb.runtime && (
                <span>• {movie.imdb.runtime}</span>
              )}

              {movie.imdb.genres?.length > 0 && (
                <span className="text-gray-400">
                  • {movie.imdb.genres.join(" • ")}
                </span>
              )}
            </div>
          )}

          <p className="mt-4 text-sm sm:text-base text-gray-300">
            {movie.description}
          </p>

          <div className="mt-6 flex gap-3">
            <Link
              to={`/play/${movie.id}`}
              className="bg-white text-black px-6 py-2 rounded font-semibold"
            >
              ▶ Play
            </Link>

            {movie.imdb?.id && (
              <a
                href={`https://www.imdb.com/title/${movie.imdb.id}`}
                target="_blank"
                rel="noreferrer"
                className="bg-gray-700/80 px-6 py-2 rounded hover:bg-gray-600"
              >
                IMDb
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
