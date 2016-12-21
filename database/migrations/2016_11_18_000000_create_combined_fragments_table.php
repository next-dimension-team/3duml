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
            $table->timestamps();
            $table->string('name');
            $table->enum('operator', ['alt', 'opt', 'par', 'loop', 'critical', 'neg', 'assert', 'strict', 'seq', 'ignore', 'consider']);
        });
    }

    public function down()
    {
        Schema::drop('combined_fragments');
    }
}
