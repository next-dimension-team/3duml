<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateLifelinesInteractionOperandsTable extends Migration {

    public function up()
    {
        Schema::create('lifelines_interaction_operands', function(Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->integer('lifeline_id')->unsigned();
            $table->integer('interaction_operand_id')->unsigned();
        });
    }

    public function down()
    {
        Schema::drop('lifelines_interaction_operands');
    }
}