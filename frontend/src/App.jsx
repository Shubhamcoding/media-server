import { BrowserRouter, Routes, Route } from "react-router-dom";

import Movies from "./pages/Movies";
import MovieDetail from "./pages/MovieDetail";
import PlayMovie from "./pages/PlayMovie";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Movies />} />

        <Route path="/movies/:id" element={<MovieDetail />} />
        <Route path="/play/:id" element={<PlayMovie />} />
      </Routes>
    </BrowserRouter>
  );
}
