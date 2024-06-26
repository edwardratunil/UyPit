<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    public function getAllUsers()
    {
        $users = User::all();
        return response()->json($users);
    }

    public function createUser(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'address' => 'required|string',
            'birthdate' => 'required|date',
            'gender' => 'required|in:Male,Female,Other',
            'role' => 'required|string',
        ]);

        $user = User::create([
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'address' => $validated['address'],
            'birthdate' => $validated['birthdate'],
            'gender' => $validated['gender'],
            'role' => $validated['role'],
        ]);

        return response()->json(['message' => 'User created successfully', 'user' => $user], 201);
    }

    public function updateUser(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $user->update($request->all());

        return response()->json(['message' => 'User updated successfully']);
    }

    public function deleteUser($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }
}
