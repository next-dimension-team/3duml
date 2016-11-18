<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateCombinedFragmentsTable extends Migration
{
    public function up()
    {
        Schema::create('combined_fragments', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamp('timestamps');
            $table->string('name');
            $table->enum('visibility', ['public', 'package', 'protected', 'private']);
            $table->enum('interaction_operator', ['seq', 'alt', 'opt', 'break', 'par', 'loop', 'critical', 'neg', 'assert', 'strict', 'ignore', 'consider']);
        });
    }

    public function down()
    {
        Schema::drop('combined_fragments');
    }
}
