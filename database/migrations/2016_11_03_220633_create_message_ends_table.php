<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateMessageEndsTable extends Migration {

    public function up()
    {
        Schema::create('message_ends', function(Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->string('name');
            $table->string('qualified_name');
            $table->enum('visibility', ['public', 'protected', 'private', 'package']);
        });
    }

    public function down()
    {
        Schema::drop('message_ends');
    }
}