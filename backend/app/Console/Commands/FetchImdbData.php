<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\OmdbService;
use Illuminate\Support\Facades\Http;

class FetchImdbData extends Command
{
    protected $signature = 'media:fetch-imdb {movieId}';
    protected $description = 'Fetch IMDb data and poster from OMDb';

    protected OmdbService $omdb;

    public function __construct(OmdbService $omdb)
    {
        parent::__construct();
        $this->omdb = $omdb;
    }

    public function handle()
    {
        $movieId = $this->argument('movieId');

        $movieDir = storage_path("app/media/movies/{$movieId}");
        $jsonPath = $movieDir . '/movie.json';

        if (!file_exists($jsonPath)) {
            $this->error("movie.json not found for {$movieId}");
            return Command::FAILURE;
        }

        $movie = json_decode(file_get_contents($jsonPath), true);

        $this->info("Fetching IMDb data for: {$movie['title']}");

        $data = $this->omdb->fetchByTitle(
            $movie['title'],
            $movie['year'] ?? null
        );

        if (($data['Response'] ?? 'False') === 'False') {
            $this->error($data['Error'] ?? 'OMDb lookup failed');
            return Command::FAILURE;
        }

        /* ---------- SAVE IMDb METADATA ---------- */
        $movie['imdb'] = [
            'id' => $data['imdbID'] ?? null,
            'rating' => $data['imdbRating'] ?? null,
            'runtime' => $data['Runtime'] ?? null,
            'genres' => isset($data['Genre'])
                ? array_map('trim', explode(',', $data['Genre']))
                : [],
        ];

        /* ---------- DOWNLOAD POSTER IMAGE ---------- */
        if (!empty($movie['imdb']['id'])) {
            $this->info('Downloading poster image…');

            $posterResponse = Http::get('https://img.omdbapi.com/', [
                'apikey' => config('services.omdb.key'),
                'i' => $movie['imdb']['id'],
            ]);

            if ($posterResponse->successful()) {
                file_put_contents(
                    $movieDir . '/poster.jpg',
                    $posterResponse->body()
                );

                $movie['assets']['poster'] = true;
                $this->info('Poster saved successfully.');
            } else {
                $this->warn('Poster download failed.');
            }
        }

        /* ---------- SAVE UPDATED JSON ---------- */
        file_put_contents(
            $jsonPath,
            json_encode($movie, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)
        );

        $this->info('IMDb data saved successfully.');
        return Command::SUCCESS;
    }
}
