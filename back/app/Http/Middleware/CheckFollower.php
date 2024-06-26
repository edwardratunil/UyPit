<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckFollower
{
    public function handle(Request $request, Closure $next)
    {
        $post = $request->route()->parameter('post');
        $user = Auth::user();
        
        if ($post->user_id === $user->id) {
            return $next($request);
        }

        $isFollowing = $user->following()->where('following_id', $post->user_id)->exists();

        if ($isFollowing) {
            return $next($request);
        }

        return response()->json(['error' => 'Unauthorized'], 403);
    }
}
