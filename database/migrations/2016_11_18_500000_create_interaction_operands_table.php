<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateInteractionOperandsTable extends Migration
{
    public function up()
    {
        Schema::create('interaction_operands', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->timestamp('timestamps');
            $table->string('constraint');
            $table->enum('visibility', ['public', 'package', 'protected', 'private']);
        });
    }

    public function down()
    {
        Schema::drop('interaction_operands');
    }
}
