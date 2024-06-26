<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->string('title')->nullable();  // Allows storing of post titles
            $table->string('image_path')->nullable();  // Stores the path to the uploaded image file
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn('title');
            $table->dropColumn('image_path');
        });
    }
};
