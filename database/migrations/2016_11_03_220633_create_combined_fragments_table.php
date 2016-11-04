<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateCombinedFragmentsTable extends Migration {

	public function up()
	{
		Schema::create('combined_fragments', function(Blueprint $table) {
			$table->increments('id');
			$table->timestamps();
			$table->string('name');
			$table->string('qualified_name');
			$table->enum('visibility', array('public', 'protected', 'private', 'package'));
			$table->enum('interaction_operator', array('seq', 'alt', 'opt', 'break', 'par', 'strict', 'loop', 'critical', 'neg', 'assert', 'ignore', 'consider'));
		});
	}

	public function down()
	{
		Schema::drop('combined_fragments');
	}
}
