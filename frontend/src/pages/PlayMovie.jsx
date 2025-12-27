import { useParams } from "react-router-dom";

const API = import.meta.env.VITE_API_BASE_URL;

export default function PlayMovie() {
  const { id } = useParams();

  return (
    <div className="w-screen h-screen bg-black">
      <video
        key={id}
        src={`${API}/movies/${id}/stream`}
        controls
        autoPlay
        playsInline
        className="w-full h-full"
      />
    </div>
  );
}
