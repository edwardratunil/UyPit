<?php

// database/migrations/xxxx_xx_xx_create_notifications_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNotificationsTable extends Migration
{
    public function up()
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('message');
            $table->boolean('read')->default(false);
            $table->string('type');
            $table->foreignId('post_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('comment_id')->nullable()->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('notifications');
    }
}
