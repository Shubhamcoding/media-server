<?php

namespace App\Http\Controllers;

class MovieController extends Controller
{
    private function moviesRoot()
    {
        return storage_path('app/media/movies');
    }

    private function movieDir(string $id)
    {
        return $this->moviesRoot() . '/' . $id;
    }

    public function index()
    {
        $movies = [];

        foreach (glob($this->moviesRoot() . '/*/movie.json') as $file) {
            $data = json_decode(file_get_contents($file), true);
            if ($data) {
                $movies[] = $data;
            }
        }

        return response()->json($movies);
    }

    public function show(string $id)
    {
        $path = $this->movieDir($id) . '/movie.json';

        if (!file_exists($path)) {
            abort(404);
        }

        return response()->json(
            json_decode(file_get_contents($path), true)
        );
    }

    /**
     * Serve poster image (jpg, png, webp)
     */
    public function poster(string $id)
    {
        return $this->serveImage($id, 'poster');
    }

    /**
     * Serve backdrop image (jpg, png, webp)
     */
    public function backdrop(string $id)
    {
        return $this->serveImage($id, 'backdrop', true);
    }

    /**
     * Shared image resolver
     */
    private function serveImage(string $id, string $baseName, bool $fallbackToPoster = false)
    {
        $extensions = ['webp', 'jpg', 'jpeg', 'png'];

        foreach ($extensions as $ext) {
            $path = $this->movieDir($id) . "/{$baseName}.{$ext}";
            if (file_exists($path)) {
                return response()->file($path);
            }
        }

        if ($fallbackToPoster) {
            foreach ($extensions as $ext) {
                $path = $this->movieDir($id) . "/poster.{$ext}";
                if (file_exists($path)) {
                    return response()->file($path);
                }
            }
        }

        abort(404, 'Image not found');
    }

    public function stream(string $id)
    {
        $path = $this->movieDir($id) . '/movie.mp4';

        if (!file_exists($path)) {
            abort(404);
        }

        return response()->file($path, [
            'Accept-Ranges' => 'bytes',
        ]);
    }
}
