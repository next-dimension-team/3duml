<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateInteractionOperandsTable extends Migration {

	public function up()
	{
		Schema::create('interaction_operands', function(Blueprint $table) {
			$table->increments('id');
			$table->timestamps();
			$table->string('name');
			$table->string('qualified_name');
			$table->enum('visibility', array(''));
		});
	}

	public function down()
	{
		Schema::drop('interaction_operands');
	}
}