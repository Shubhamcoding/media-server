<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: null,
        api: __DIR__ . '/../routes/api.php',
        commands: null,
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Middleware can be added later
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Exception handling can be customized later
    })
    ->create();

