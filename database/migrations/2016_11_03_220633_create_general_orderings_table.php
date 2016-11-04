<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateGeneralOrderingsTable extends Migration {

	public function up()
	{
		Schema::create('general_orderings', function(Blueprint $table) {
			$table->increments('id');
			$table->timestamps();
			$table->string('name');
			$table->string('qualified_name');
			$table->enum('visibility', ['public', 'protected', 'private', 'package']);
			$table->enum('specifications_id', array('message_occurrence_specifications_id', 'execution_occurrence_specifications_id'));
			$table->enum('specifications_type', array('message_occurrence_specifications', 'execution_occurrence_specification'));
			$table->enum('orderings_id', array('state_invariants_id', 'interactions_id', 'combined_fragments_id', 'interaction_operands_id'));
			$table->enum('orderings_type', array('state_invariants', 'interactions', 'combined_fragments', 'interaction_operands'));
		});
	}

	public function down()
	{
		Schema::drop('general_orderings');
	}
}
