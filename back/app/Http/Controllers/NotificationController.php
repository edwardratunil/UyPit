<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function index()
    {
        $notifications = Notification::with(['user'])
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        // Add formatted date to each notification
        $notifications->each(function ($notification) {
            $notification->formatted_date = $notification->created_at->format('F j, Y, g:i a');
        });

        return response()->json($notifications);
    }

    public function markAsRead()
    {
        Notification::where('user_id', Auth::id())
            ->where('read', false)
            ->update(['read' => true]);

        return response()->json(['message' => 'Notifications marked as read']);
    }

    public function store(Request $request)
    {
        $notification = Notification::create([
            'user_id' => $request->user_id,
            'message' => $request->message,
            'type' => $request->type,
            'post_id' => $request->post_id,
            'comment_id' => $request->comment_id,
            'related_id' => $request->related_id,
        ]);

        return response()->json($notification, 201);
    }

    public function destroy($id)
    {
        $notification = Notification::where('id', $id)->where('user_id', Auth::id())->first();
        if ($notification) {
            $notification->delete();
            return response()->json(['message' => 'Notification deleted successfully']);
        }
        return response()->json(['message' => 'Notification not found'], 404);
    }
}



