<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateInteractionFragmentsTable extends Migration {

	public function up()
	{
		Schema::create('interaction_fragments', function(Blueprint $table) {
			$table->increments('id');
			$table->timestamp('timestamps');
			$table->integer('enclosing_fragment_id')->unsigned();
			$table->integer('fragmentable_id');
			$table->enum('fragmentable_type', array('combined_fragments', 'interaction_operands', 'interactions'));
		});
	}

	public function down()
	{
		Schema::drop('interaction_fragments');
	}
}