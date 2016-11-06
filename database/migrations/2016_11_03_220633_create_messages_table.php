<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateMessagesTable extends Migration
{
    public function up()
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->string('name');
            $table->string('qualified_name');
            $table->enum('visibility', ['public', 'protected', 'private', 'package']);
            $table->enum('message_kind', ['complete', 'lost', 'found', 'unknown']);
            $table->enum('message_sort', ['synchCall', 'asynchCall', 'asynchSignal', 'createMessage', 'deleteMessage', 'reply']);
            $table->integer('interaction_id')->unsigned();
        });
    }

    public function down()
    {
        Schema::drop('messages');
    }
}
