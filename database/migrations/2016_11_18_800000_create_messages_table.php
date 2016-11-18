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
            $table->timestamp('timestamps');
            $table->string('name');
            $table->enum('visibility', ['']);
            $table->integer('interaction_id')->unsigned();
            $table->enum('kind', ['complete', 'found', 'lost', 'unknown']);
            $table->enum('sort', ['synchCall', 'asynchCall', 'asynchSignal', 'createMessage', 'deleteMessage', 'reply']);
            $table->integer('send_event_id')->unsigned();
            $table->integer('receive_event_id')->unsigned();
        });
    }

    public function down()
    {
        Schema::drop('messages');
    }
}
