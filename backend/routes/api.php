<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MovieController;

Route::get('/movies', [MovieController::class, 'index']);
Route::get('/movies/{id}', [MovieController::class, 'show']);
Route::get('/movies/{id}/poster', [MovieController::class, 'poster']);
Route::get('/movies/{id}/backdrop', [MovieController::class, 'backdrop']);
Route::get('/movies/{id}/stream', [MovieController::class, 'stream']);

