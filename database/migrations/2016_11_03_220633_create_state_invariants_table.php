<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateStateInvariantsTable extends Migration {

	public function up()
	{
		Schema::create('state_invariants', function(Blueprint $table) {
			$table->increments('id');
			$table->timestamps();
			$table->string('name');
			$table->string('qualified_name');
			$table->enum('visibility', array(''));
			$table->integer('lifeline_id')->unsigned();
		});
	}

	public function down()
	{
		Schema::drop('state_invariants');
	}
}