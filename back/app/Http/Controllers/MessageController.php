<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Notification;

class MessageController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index($userId)
    {
        $user = Auth::user();
        $messages = Message::with(['sender', 'receiver'])->where(function($query) use ($user, $userId) {
            $query->where('sender_id', $user->id)
                  ->where('receiver_id', $userId);
        })->orWhere(function($query) use ($user, $userId) {
            $query->where('sender_id', $userId)
                  ->where('receiver_id', $user->id);
        })->orderBy('created_at')->get();

        $messages->each(function ($message) {
            $message->sender->profile_image_url = $message->sender->profile_image ? asset('storage/' . $message->sender->profile_image) : null;
            $message->receiver->profile_image_url = $message->receiver->profile_image ? asset('storage/' . $message->receiver->profile_image) : null;
        });

        return response()->json($messages);
    }

    public function store(Request $request, $userId)
    {
        $user = Auth::user();

        $message = Message::create([
            'sender_id' => $user->id,
            'receiver_id' => $userId,
            'content' => $request->content,
        ]);

        Notification::create([
            'user_id' => $userId,
            'message' => "New message from {$user->first_name} {$user->last_name}",
            'type' => 'message',
            'related_id' => $user->id, // This is the ID of the sender for the conversation
        ]);

        // $message->sender->profile_image_url = $user->profile_image ? asset('storage/' . $user->profile_image) : null;

        return response()->json($message->load('sender'));
    }

    public function conversations()
    {
        $user = Auth::user();
        $conversations = User::whereHas('messages', function($query) use ($user) {
            $query->where('sender_id', $user->id)
                ->orWhere('receiver_id', $user->id);
        })->get(['id', 'first_name', 'last_name', 'profile_image']);

        $conversations->each(function ($conversation) {
            $conversation->profile_image_url = $conversation->profile_image ? asset('storage/' . $conversation->profile_image) : null;
        });

        return response()->json($conversations);
    }
}
