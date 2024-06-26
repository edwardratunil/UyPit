<?php
// app/Http/Middleware/HandleCors.php
namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Closure;

class HandleCors
{
    public function handle(Request $request, Closure $next)
    {
        return $next($request)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
}
