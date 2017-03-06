<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateLifelinesTable extends Migration
{
    public function up()
    {
        Schema::create('lifelines', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->string('name');
            $table->integer('layer_id')->unsigned();
            $table->integer('order')->unsigned();
        });
    }

    public function down()
    {
        Schema::drop('lifelines');
    }
}
