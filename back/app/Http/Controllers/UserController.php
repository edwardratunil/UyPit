<?php

// namespace App\Http\Controllers;

// use Illuminate\Http\Request;
// use App\Models\User;
// use App\Models\Post;
// use Illuminate\Support\Facades\Auth;
// use Illuminate\Support\Facades\Storage;
// use Illuminate\Support\Facades\Hash;

// class UserController extends Controller
// {
//     public function search(Request $request)
//     {
//         $query = $request->input('query');
//         $userId = Auth::id();

//         $users = User::where('id', '!=', $userId)
//             ->where(function ($q) use ($query) {
//                 if ($query) {
//                     $q->where('first_name', 'like', "%{$query}%")
//                       ->orWhere('last_name', 'like', "%{$query}%")
//                       ->orWhere('email', 'like', "%{$query}%");
//                 }
//             })->get();

//         $users->each(function ($user) {
//             $user->profile_image_url = $user->profile_image ? asset('storage/' . $user->profile_image) : null;
//         });

//         return response()->json($users);
//     }

//     public function getUser()
//     {
//         $user = Auth::user();
//         $user->profile_image_url = $user->profile_image ? asset('storage/' . $user->profile_image) : null;

//         return response()->json([
//             'first_name' => $user->first_name,
//             'last_name' => $user->last_name,
//             'email' => $user->email,
//             'address' => $user->address,
//             'birthdate' => $user->birthdate,
//             'gender' => $user->gender,
//             'profile_image_url' => $user->profile_image_url,
//         ]);
//     }

//     public function update(Request $request)
//     {
//         $user = Auth::user();

//         $validatedData = $request->validate([
//             'firstName' => 'required|string|max:255',
//             'lastName' => 'required|string|max:255',
//             'email' => 'required|email|max:255|unique:users,email,' . $user->id,
//             'address' => 'nullable|string|max:255',
//             'birthdate' => 'nullable|date',
//             'gender' => 'nullable|in:Male,Female,Other',
//         ]);
//         $user->update([
//             'first_name' => $validatedData['firstName'],
//             'last_name' => $validatedData['lastName'],
//             'email' => $validatedData['email'],
//             'address' => $validatedData['address'],
//             'birthdate' => $validatedData['birthdate'],
//             'gender' => $validatedData['gender'],
//         ]);

//         return response()->json(['message' => 'Information updated successfully']);
//     }

//     // Change user password
//     public function changePassword(Request $request)
//     {
//         $user = Auth::user();

//         $request->validate([
//             'currentPassword' => 'required',
//             'newPassword' => 'required|min:8|confirmed', // This ensures newPassword and confirmPassword match
//         ]);

//         if (!Hash::check($request->currentPassword, $user->password)) {
//             return response()->json(['message' => 'Current password is incorrect'], 422);
//         }

//         $user->password = bcrypt($request->newPassword);
//         $user->save();

//         return response()->json(['message' => 'Password changed successfully']);
//     }

//     // Upload profile image
//     public function uploadProfileImage(Request $request)
//     {
//         $request->validate([
//             'profile_image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
//         ]);

//         $user = Auth::user();
//         $imagePath = $request->file('profile_image')->store('profile_images', 'public');

//         // Delete old image if exists
//         if ($user->profile_image) {
//             Storage::disk('public')->delete($user->profile_image);
//         }

//         $user->update(['profile_image' => $imagePath]);

//         return response()->json(['message' => 'Profile image uploaded successfully', 'profile_image_url' => asset('storage/' . $imagePath)]);
//     }

//     public function show($id)
//     {
//         $user = User::with('posts')->findOrFail($id);
//         $user->profile_image_url = $user->profile_image ? asset('storage/' . $user->profile_image) : null;
        
//         return response()->json([
//             'first_name' => $user->first_name,
//             'last_name' => $user->last_name,
//             'email' => $user->email,
//             'address' => $user->address,
//             'birthdate' => $user->birthdate,
//             'gender' => $user->gender,
//             'role' => $user->role,
//             'profile_image_url' => $user->profile_image_url,
//             'posts' => $user->posts
//         ]);
//     }

//     public function posts($id)
//     {
//         $posts = Post::where('user_id', $id)->get();
//         return response()->json($posts);
//     }

//     public function getUserPosts()
//     {
//         $user = Auth::user();
//         $posts = $user->posts; // Assuming the User model has a relationship with Post model

//         return response()->json($posts);
//     }
// }


namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Post;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Rules\StrongPassword;

class UserController extends Controller
{
    // Search for users excluding the authenticated user
    public function search(Request $request)
    {
        $query = $request->input('query');
        $userId = Auth::id();

        $users = User::where('id', '!=', $userId)
            ->where(function ($q) use ($query) {
                if ($query) {
                    $q->where('first_name', 'like', "%{$query}%")
                      ->orWhere('last_name', 'like', "%{$query}%")
                      ->orWhere('email', 'like', "%{$query}%");
                }
            })->get();

        $users->each(function ($user) {
            $user->profile_image_url = $user->profile_image ? asset('storage/' . $user->profile_image) : null;
        });

        return response()->json($users);
    }

    // Get authenticated user details
    public function getUser()
    {
        $user = Auth::user();
        $user->profile_image_url = $user->profile_image ? asset('storage/' . $user->profile_image) : null;

        return response()->json([
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'email' => $user->email,
            'address' => $user->address,
            'birthdate' => $user->birthdate,
            'gender' => $user->gender,
            'role' => $user->role, // Include role
            'profile_image_url' => $user->profile_image_url,
        ]);
    }

    // Update user information
    public function update(Request $request)
    {
        $user = Auth::user();

        $validatedData = $request->validate([
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
            'address' => 'nullable|string|max:255',
            'birthdate' => 'nullable|date|before:today',
            'gender' => 'nullable|in:Male,Female,Other',
        ]);

        $user->update([
            'first_name' => $validatedData['firstName'],
            'last_name' => $validatedData['lastName'],
            'email' => $validatedData['email'],
            'address' => $validatedData['address'],
            'birthdate' => $validatedData['birthdate'],
            'gender' => $validatedData['gender'],
        ]);

        return response()->json(['message' => 'Information updated successfully']);
    }

    // Change user password
    public function changePassword(Request $request)
    {
        $user = Auth::user();

        // Validate the request data
        $validator = Validator::make($request->all(), [
            'currentPassword' => 'required',
            'newPassword' => ['required', 'min:8', 'confirmed', new StrongPassword()],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Check if the current password matches
        if (!Hash::check($request->currentPassword, $user->password)) {
            return response()->json(['errors' => ['currentPassword' => ['Current password is incorrect']]], 422);
        }

        // Update the user's password
        $user->password = Hash::make($request->newPassword);
        $user->save();

        return response()->json(['message' => 'Password changed successfully']);
    }

    // Upload profile image
    public function uploadProfileImage(Request $request)
    {
        $request->validate([
            'profile_image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $user = Auth::user();
        $imagePath = $request->file('profile_image')->store('profile_images', 'public');

        // Delete old image if exists
        if ($user->profile_image) {
            Storage::disk('public')->delete($user->profile_image);
        }

        $user->update(['profile_image' => $imagePath]);

        return response()->json(['message' => 'Profile image uploaded successfully', 'profile_image_url' => asset('storage/' . $imagePath)]);
    }

    // Get user details by ID
    public function show($id)
    {
        $user = User::with('posts')->findOrFail($id);
        $user->profile_image_url = $user->profile_image ? asset('storage/' . $user->profile_image) : null;

        return response()->json([
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'email' => $user->email,
            'address' => $user->address,
            'birthdate' => $user->birthdate,
            'gender' => $user->gender,
            'role' => $user->role,
            'profile_image_url' => $user->profile_image_url,
            'posts' => $user->posts
        ]);
    }

    // Get posts by user ID
    public function posts($id)
    {
        $posts = Post::where('user_id', $id)->get();
        return response()->json($posts);
    }

    // Get authenticated user's posts
    public function getUserPosts()
    {
        $user = Auth::user();
        $posts = $user->posts; // Assuming the User model has a relationship with Post model

        return response()->json($posts);
    }
}