<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateOccurenceSpecificationsTable extends Migration
{
    public function up()
    {
        Schema::create('occurence_specifications', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->integer('time');
            $table->integer('lifeline_id')->unsigned();
        });
    }

    public function down()
    {
        Schema::drop('occurence_specifications');
    }
}
