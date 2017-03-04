<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateLayersTable extends Migration
{
    public function up()
    {
        Schema::create('layers', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->string('name');
            $table->integer('depth')->unsigned();
        });
    }

    public function down()
    {
        Schema::drop('layers');
    }
}
