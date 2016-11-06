<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateLifelinesCombinedFragmentsTable extends Migration
{
    public function up()
    {
        Schema::create('lifelines_combined_fragments', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->integer('combined_fragment_id')->unsigned();
            $table->integer('lifeline_id')->unsigned();
        });
    }

    public function down()
    {
        Schema::drop('lifelines_combined_fragments');
    }
}
