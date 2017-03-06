<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateOccurrenceSpecificationsTable extends Migration
{
    public function up()
    {
        Schema::create('occurrence_specifications', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->integer('order')->unsigned();
            $table->integer('lifeline_id')->unsigned();
        });
    }

    public function down()
    {
        Schema::drop('occurrence_specifications');
    }
}
