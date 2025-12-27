import { useParams } from "react-router-dom";

const API = import.meta.env.VITE_API_BASE_URL;

export default function PlayMovie() {
  const { id } = useParams();

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <video
        key={id}
        src={`${API}/movies/${id}/stream`}
        controls
        autoPlay
        playsInline
        className="
          w-full h-full
          max-w-none
          bg-black
          outline-none
        "
      >
        <source src={`${API}/movies/${id}/stream`} type="video/mp4" />
        {/* subtitles will go here later */}
      </video>
    </div>
  );
}
