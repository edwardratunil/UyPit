<?php

// namespace App\Http\Controllers;

// use App\Models\User;
// use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Hash;
// use Illuminate\Support\Facades\Auth;

// class AuthController extends Controller
// {
//     public function register(Request $request)
//     {
//         try {
//             $validated = $request->validate([
//                 'email' => 'required|email|unique:users',
//                 'password' => 'required|min:6',
//                 'first_name' => 'required|string',
//                 'last_name' => 'required|string',
//                 'address' => 'required|string',
//                 'birthdate' => 'required|date',
//                 'gender' => 'required|in:Male,Female,Other',
//             ]);

//             $user = User::create([
//                 'email' => $validated['email'],
//                 'password' => Hash::make($validated['password']),
//                 'first_name' => $validated['first_name'],
//                 'last_name' => $validated['last_name'],
//                 'address' => $validated['address'],
//                 'birthdate' => $validated['birthdate'],
//                 'gender' => $validated['gender'],
//                 'role' => 'user', // Assign default role
//             ]);

//             $token = $user->createToken('auth_token')->plainTextToken;

//             return response()->json([
//                 'user' => $user,
//                 'token' => $token,
//             ], 201);
//         } catch (\Exception $e) {
//             \Log::error('Registration Error: ' . $e->getMessage());
//             return response()->json(['message' => 'Registration failed'], 500);
//         }
//     }

//     public function login(Request $request)
//     {
//         $credentials = $request->validate([
//             'email' => 'required|email',
//             'password' => 'required',
//         ]);

//         if (Auth::attempt($credentials)) {
//             $user = Auth::user();
//             $token = $user->createToken('auth_token')->plainTextToken;

//             return response()->json([
//                 'user' => $user,
//                 'token' => $token,
//             ], 200);
//         }

//         return response()->json(['message' => 'Invalid credentials'], 401);
//     }
// }

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Rules\StrongPassword;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:users',
            'password' => ['required', 'min:8', new StrongPassword],
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'birthdate' => 'required|date|before:today',
            'gender' => 'required|in:Male,Female,Other',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $validated = $validator->validated();

            $user = User::create([
                'email' => filter_var($validated['email'], FILTER_SANITIZE_EMAIL),
                'password' => Hash::make($validated['password']),
                'first_name' => filter_var($validated['first_name'], FILTER_SANITIZE_STRING),
                'last_name' => filter_var($validated['last_name'], FILTER_SANITIZE_STRING),
                'address' => filter_var($validated['address'], FILTER_SANITIZE_STRING),
                'birthdate' => $validated['birthdate'],
                'gender' => $validated['gender'],
                'role' => 'user', // Assign default role
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'user' => $user,
                'token' => $token,
            ], 201);
        } catch (\Exception $e) {
            \Log::error('Registration Error: ' . $e->getMessage());
            return response()->json(['message' => 'Registration failed'], 500);
        }
    }

    // public function login(Request $request)
    // {
    //     $validator = Validator::make($request->all(), [
    //         'email' => 'required|email',
    //         'password' => 'required',
    //     ]);

    //     if ($validator->fails()) {
    //         return response()->json(['errors' => $validator->errors()], 422);
    //     }

    //     $credentials = $validator->validated();

    //     if (Auth::attempt($credentials)) {
    //         $user = Auth::user();
    //         $token = $user->createToken('auth_token')->plainTextToken;

    //         return response()->json([
    //             'user' => $user,
    //             'token' => $token,
    //         ], 200);
    //     }

    //     return response()->json(['errors' => ['email' => ['Invalid credentials']]], 401);
    // }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $credentials = $validator->validated();

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'user' => [
                    'id' => $user->id,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'email' => $user->email,
                    'role' => $user->role, // Include role
                    'profile_image_url' => $user->profile_image ? asset('storage/' . $user->profile_image) : null,
                ],
                'token' => $token,
            ], 200);
        }

        return response()->json(['errors' => ['email' => ['Invalid credentials']]], 401);
    }

}
