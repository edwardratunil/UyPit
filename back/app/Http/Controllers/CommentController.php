<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use App\Models\Notification; // Add this import
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function store(Request $request, Post $post)
    {
        $validated = $request->validate([
            'content' => 'required|string',
        ]);

        $comment = Comment::create([
            'post_id' => $post->id,
            'user_id' => Auth::id(),
            'content' => $validated['content'],
        ]);

        $comment->load('user');
        $comment->user->profile_image_url = $comment->user->profile_image_url;

        // Notify post owner
        if ($post->user_id != Auth::id()) {
            Notification::create([
                'user_id' => $post->user_id,
                'message' => Auth::user()->name . ' commented on your post',
                'type' => 'comment',
                'post_id' => $post->id,
                'comment_id' => $comment->id,
            ]);
        }

        // Notify other commenters
        $commenters = $post->comments()
            ->where('user_id', '!=', Auth::id())
            ->distinct('user_id')
            ->pluck('user_id');

        foreach ($commenters as $commenter) {
            Notification::create([
                'user_id' => $commenter,
                'message' => Auth::user()->name . ' also commented on a post you commented on',
                'type' => 'comment',
                'post_id' => $post->id,
                'comment_id' => $comment->id,
            ]);
        }

        return response()->json($comment, 201);
    }

    public function update(Request $request, Comment $comment)
    {
        $this->authorize('update', $comment);

        $validated = $request->validate([
            'content' => 'required|string',
        ]);

        $comment->update([
            'content' => $validated['content'],
        ]);

        $comment->load('user');
        $comment->user->profile_image_url = $comment->user->profile_image_url;

        return response()->json($comment);
    }

    public function destroy(Comment $comment)
    {
        $this->authorize('delete', $comment);

        $comment->delete();

        return response()->json(['message' => 'Comment deleted successfully']);
    }
}