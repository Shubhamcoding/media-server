import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_BASE_URL;

export default function Movies() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch(`${API}/movies`)
      .then(res => res.json())
      .then(setMovies)
      .catch(console.error);
  }, []);

  return (
    <div className="p-4 bg-black min-h-screen text-white">
      <h1 className="text-xl font-semibold mb-4">Movies</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {movies.map(movie => (
          <Link
            key={movie.id}
            to={`/movies/${movie.id}`}
            className="group"
          >
            <div className="space-y-2">
              <img
                src={`${API}/movies/${movie.id}/poster`}
                alt={movie.title}
                className="rounded-lg aspect-[2/3] object-cover
                           group-hover:scale-105 transition-transform"
              />
              <p className="text-sm font-medium group-hover:text-gray-300">
                {movie.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
