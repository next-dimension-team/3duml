<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateExecutionSpecificationsTable extends Migration {

	public function up()
	{
		Schema::create('execution_specifications', function(Blueprint $table) {
			$table->increments('id');
			$table->timestamps();
			$table->integer('start_occurence_specification_id')->unsigned();
			$table->integer('finish_occurence_specification_id')->unsigned();
		});
	}

	public function down()
	{
		Schema::drop('execution_specifications');
	}
}