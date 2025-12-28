import { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const API = import.meta.env.VITE_API_BASE_URL;

export default function PlayMovie() {
  const { id } = useParams();

  const containerRef = useRef(null);
  const videoRef = useRef(null);

  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);

  /* ---------- VIDEO EVENTS ---------- */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTime = () => setProgress(video.currentTime);
    const onMeta = () => setDuration(video.duration);

    video.addEventListener("timeupdate", onTime);
    video.addEventListener("loadedmetadata", onMeta);

    return () => {
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("loadedmetadata", onMeta);
    };
  }, []);

  /* ---------- ACTIONS ---------- */
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  /* ---------- KEYBOARD SHORTCUTS ---------- */
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      }

      if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const seek = (e) => {
    const video = videoRef.current;
    if (!video) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    video.currentTime = percent * duration;
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black"
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* VIDEO */}
      <video
        ref={videoRef}
        src={`${API}/movies/${id}/stream`}
        autoPlay
        playsInline
        controls={false}
        className="w-full h-full object-contain bg-black cursor-pointer"
        onClick={togglePlay}
      />

      {/* OVERLAY */}
      {showControls && (
        <div className="absolute inset-0 flex flex-col justify-end pointer-events-none">
          <div className="bg-gradient-to-t from-black/80 to-transparent p-4 pointer-events-auto">
            <div
              className="w-full h-1 bg-gray-600 rounded cursor-pointer mb-4"
              onClick={seek}
            >
              <div
                className="h-full bg-red-600 rounded"
                style={{
                  width: duration
                    ? `${(progress / duration) * 100}%`
                    : "0%",
                }}
              />
            </div>

            <div className="flex justify-between text-white">
              <button onClick={togglePlay}>
                {playing ? "⏸" : "▶"}
              </button>
              <button onClick={toggleFullscreen}>⛶</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
