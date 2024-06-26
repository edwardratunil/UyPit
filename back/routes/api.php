<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\FollowController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\AdminController;

use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\ResetPasswordController;

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetLinkEmail']);
Route::post('/reset-password', [ResetPasswordController::class, 'reset']);

Route::middleware('auth:sanctum')->group(function () {
    // Admin routes
    Route::middleware('admin')->group(function () {
        Route::get('/admin/users', [AdminController::class, 'getAllUsers']);
        Route::post('/admin/users', [AdminController::class, 'createUser']);
        Route::put('/admin/users/{id}', [AdminController::class, 'updateUser']);
        Route::delete('/admin/users/{user}', [AdminController::class, 'deleteUser']);
    });

    // Post routes
    Route::get('posts', [PostController::class, 'index']);
    Route::post('posts', [PostController::class, 'store']);
    Route::get('posts/{post}', [PostController::class, 'show']);
    Route::put('posts/{post}', [PostController::class, 'update']);
    Route::delete('posts/{post}', [PostController::class, 'destroy']);

    // Follow routes
    Route::post('/follow', [FollowController::class, 'follow']);
    Route::post('/unfollow', [FollowController::class, 'unfollow']);
    Route::get('/following', [FollowController::class, 'getFollowing']);
    Route::get('/followers', [FollowController::class, 'getFollowers']);

    // Comment routes
    Route::post('posts/{post}/comments', [CommentController::class, 'store']);
    Route::put('comments/{comment}', [CommentController::class, 'update']);
    Route::delete('comments/{comment}', [CommentController::class, 'destroy']);

    // Like routes
    Route::post('/posts/{id}/like', [LikeController::class, 'likePost']);

    // Notification routes
    Route::get('notifications', [NotificationController::class, 'index']);
    Route::post('notifications/mark-as-read', [NotificationController::class, 'markAsRead']);
    Route::delete('notifications/{id}', [NotificationController::class, 'destroy']);

    // Message routes
    Route::get('/messages/conversations', [MessageController::class, 'conversations']);
    Route::get('/messages/{userId}', [MessageController::class, 'index']);
    Route::post('/messages/{userId}', [MessageController::class, 'store']);

    // User routes
    Route::get('/search', [UserController::class, 'search']);
    Route::get('/user', [UserController::class, 'getUser']);
    Route::get('/users/{user}', [UserController::class, 'show']);
    Route::get('users/{id}/posts', [UserController::class, 'posts']);
    Route::put('/update', [UserController::class, 'update']);
    Route::post('/user/change-password', [UserController::class, 'changePassword']);
    Route::post('/user/upload-profile-image', [UserController::class, 'uploadProfileImage']);
    Route::get('/user/posts', [UserController::class, 'getUserPosts']);
});
