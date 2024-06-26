<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Like;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PostController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $posts = Post::with(['user', 'comments.user', 'likes'])
            ->whereIn('user_id', $user->follows()->pluck('followed_user_id'))
            ->orWhere('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate(5);

        $posts->each(function ($post) use ($user) {
            $post->user->profile_image_url = $post->user->profile_image_url;
            $post->comments->each(function ($comment) {
                $comment->user->profile_image_url = $comment->user->profile_image_url;
            });
            $post->likes_count = $post->likes()->count();
            $post->liked = $post->likes()->where('user_id', $user->id)->exists();
            // Adding full URL for the image
            $post->image_url = $post->image_path ? asset('storage/' . $post->image_path) : null;
        });

        return response()->json($posts);
    }

    public function show($id)
    {
        $post = Post::with(['user', 'comments.user'])
            ->findOrFail($id);

        $post->user->profile_image_url = $post->user->profile_image_url;
        $post->comments->each(function ($comment) {
            $comment->user->profile_image_url = $comment->user->profile_image_url;
        });
        $post->likes_count = $post->likes()->count();
        $post->liked = $post->likes()->where('user_id', Auth::id())->exists();

        return response()->json($post);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'sometimes|string',  // Changed to sometimes to make it optional
            'file' => 'nullable|image|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('file')) {
            $imagePath = $request->file('file')->store('posts_images', 'public');
        }

        $post = Post::create([
            'user_id' => Auth::id(),
            'title' => $validated['title'],
            'content' => $validated['content'] ?? null,  // Use null if not provided
            'image_path' => $imagePath,
        ]);

        // Adding full URL for the image
        $post->image_url = $imagePath ? asset('storage/' . $imagePath) : null;

        return response()->json($post, 201);
    }


    public function update(Request $request, Post $post)
    {
        $this->authorize('update', $post);

        $validated = $request->validate([
            'content' => 'required|string',
        ]);

        $post->update([
            'content' => $validated['content'],
        ]);

        $post->load('user');
        $post->user->profile_image_url = $post->user->profile_image_url;
        $post->likes_count = $post->likes()->count();
        $post->liked = $post->likes()->where('user_id', Auth::id())->exists();

        return response()->json($post);
    }

    public function destroy(Post $post)
    {
        $this->authorize('delete', $post);
        $post->delete();

        return response()->json(['message' => 'Post deleted successfully']);
    }

    public function likePost($postId)
    {
        $post = Post::findOrFail($postId);
        $user = Auth::user();

        if ($post->likes()->where('user_id', $user->id)->exists()) {
            return response()->json(['message' => 'Already liked this post'], 200);
        }

        $post->likes()->create(['user_id' => $user->id]);

        $post->load('likes');
        return response()->json($post);
    }

    public function unlikePost($postId)
    {
        $post = Post::findOrFail($postId);
        $user = Auth::user();

        $like = $post->likes()->where('user_id', $user->id)->first();
        if ($like) {
            $like->delete();
        }

        $post->load('likes');
        return response()->json($post);
    }

}
