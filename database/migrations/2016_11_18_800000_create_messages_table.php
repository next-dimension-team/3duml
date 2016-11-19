<?php

use Illuminate\Support\Facades\Schema;
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
            $table->enum('sort', ['synchCall', 'asynchCall', 'asynchSignal', 'createMessage', 'deleteMessage', 'reply']);
            $table->integer('interaction_id')->unsigned();
            $table->integer('send_event_id')->unsigned()->nullable();
            $table->integer('receive_event_id')->unsigned()->nullable();
        });
    }

    public function down()
    {
        Schema::drop('messages');
    }
}
