<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateLifelinesTable extends Migration {

	public function up()
	{
		Schema::create('lifelines', function(Blueprint $table) {
			$table->increments('id');
			$table->timestamps();
			$table->string('name');
			$table->string('qualified_name');
			$table->enum('visibility', array(''));
			$table->integer('interaction_id')->unsigned();
		});
	}

	public function down()
	{
		Schema::drop('lifelines');
	}
}