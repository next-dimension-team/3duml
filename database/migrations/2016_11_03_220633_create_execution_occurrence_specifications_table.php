<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateExecutionOccurrenceSpecificationsTable extends Migration {

	public function up()
	{
		Schema::create('execution_occurrence_specifications', function(Blueprint $table) {
			$table->increments('id');
			$table->timestamps();
			$table->string('name');
			$table->string('qualified_name');
			$table->enum('visibility', ['public', 'protected', 'private', 'package']);
			$table->integer('lifeline_id')->unsigned();
			$table->integer('order');
		});
	}

	public function down()
	{
		Schema::drop('execution_occurrence_specifications');
	}
}
