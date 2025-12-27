<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class OmdbService
{
    public function fetchByTitle(string $title, int $year = null)
    {
        $query = [
            'apikey' => config('services.omdb.key'),
            't' => $title,
        ];

        if ($year) {
            $query['y'] = $year;
        }

        return Http::get('https://www.omdbapi.com/', $query)->json();
    }
}
