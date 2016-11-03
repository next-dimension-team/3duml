<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateMessageOccurrenceSpecificationsTable extends Migration {

	public function up()
	{
		Schema::create('message_occurrence_specifications', function(Blueprint $table) {
			$table->increments('id');
			$table->timestamps();
			$table->string('name');
			$table->string('qualified_name');
			$table->enum('visibility', array(''));
			$table->integer('lifeline_id')->unsigned();
			$table->integer('order');
		});
	}

	public function down()
	{
		Schema::drop('message_occurrence_specifications');
	}
}