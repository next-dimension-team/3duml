<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateInteractionFragmentsTable extends Migration
{
    public function up()
    {
        Schema::create('interaction_fragments', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->integer('parent_id')->unsigned()->nullable();
            $table->integer('lft')->unsigned()->nullable();
            $table->integer('rgt')->unsigned()->nullable();
            $table->integer('depth')->unsigned()->nullable();
            $table->morphs('fragmentable');
        });
    }

    public function down()
    {
        Schema::drop('interaction_fragments');
    }
}
