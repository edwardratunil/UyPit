<?php

// database/migrations/xxxx_xx_xx_xxxxxx_create_users_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->string('password');
            $table->string('first_name');
            $table->string('last_name');
            $table->text('address');
            $table->date('birthdate');
            $table->enum('gender', ['Male', 'Female', 'Other']);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('users');
    }
}
