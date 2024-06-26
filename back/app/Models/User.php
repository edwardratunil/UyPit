<?php

// namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Foundation\Auth\User as Authenticatable;
// use Illuminate\Notifications\Notifiable;
// use Laravel\Sanctum\HasApiTokens;
// use Illuminate\Database\Eloquent\Relations\BelongsToMany;

// class User extends Authenticatable
// {
//     use HasApiTokens, HasFactory, Notifiable;

//     protected $fillable = [
//         'email',
//         'password',
//         'first_name',
//         'last_name',
//         'address',
//         'birthdate',
//         'gender',
//         'profile_image',
//         'role', // Include role in fillable
//     ];

//     protected $hidden = [
//         'password',
//         'remember_token',
//     ];

//     protected $casts = [
//         'email_verified_at' => 'datetime',
//         'birthdate' => 'date',
//     ];

//     public function posts()
//     {
//         return $this->hasMany(Post::class);
//     }

//     public function comments()
//     {
//         return $this->hasMany(Comment::class);
//     }

//     public function likes()
//     {
//         return $this->hasMany(Like::class);
//     }

//     public function follows(): BelongsToMany
//     {
//         return $this->belongsToMany(User::class, 'follows', 'user_id', 'followed_user_id');
//     }

//     public function followers(): BelongsToMany
//     {
//         return $this->belongsToMany(User::class, 'follows', 'followed_user_id', 'user_id');
//     }
//     public function messages()
//     {
//         return $this->hasMany(Message::class, 'sender_id');
//     }

//     public function getProfileImageUrlAttribute()
//     {
//         return $this->profile_image ? asset('storage/' . $this->profile_image) : null;
//     }
    
// }

namespace App\Models;

use Illuminate\Contracts\Auth\CanResetPassword;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Auth\Passwords\CanResetPassword as CanResetPasswordTrait;

class User extends Authenticatable implements CanResetPassword
{
    use HasApiTokens, HasFactory, Notifiable, CanResetPasswordTrait;

    protected $fillable = [
        'email',
        'password',
        'first_name',
        'last_name',
        'address',
        'birthdate',
        'gender',
        'profile_image',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'birthdate' => 'date',
    ];

    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function likes()
    {
        return $this->hasMany(Like::class);
    }

    public function follows(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'follows', 'user_id', 'followed_user_id');
    }

    public function followers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'follows', 'followed_user_id', 'user_id');
    }

    public function messages()
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function getProfileImageUrlAttribute()
    {
        return $this->profile_image ? asset('storage/' . $this->profile_image) : null;
    }
}
