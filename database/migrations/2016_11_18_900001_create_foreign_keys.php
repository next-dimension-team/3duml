<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Eloquent\Model;

class CreateForeignKeys extends Migration {

	public function up()
	{
		Schema::table('messages', function(Blueprint $table) {
			$table->foreign('interaction_id')->references('id')->on('interactions')
						->onDelete('restrict')
						->onUpdate('restrict');
		});
		Schema::table('messages', function(Blueprint $table) {
			$table->foreign('send_event_id')->references('id')->on('occurence_specifications')
						->onDelete('restrict')
						->onUpdate('restrict');
		});
		Schema::table('messages', function(Blueprint $table) {
			$table->foreign('receive_event_id')->references('id')->on('occurence_specifications')
						->onDelete('restrict')
						->onUpdate('restrict');
		});
		Schema::table('interaction_fragments', function(Blueprint $table) {
			$table->foreign('enclosing_fragment_id')->references('id')->on('interaction_fragments')
						->onDelete('restrict')
						->onUpdate('restrict');
		});
		Schema::table('execution_specifications', function(Blueprint $table) {
			$table->foreign('start_occurence_specification_id')->references('id')->on('occurence_specifications')
						->onDelete('restrict')
						->onUpdate('restrict');
		});
		Schema::table('execution_specifications', function(Blueprint $table) {
			$table->foreign('finish_occurence_specification_id')->references('id')->on('occurence_specifications')
						->onDelete('restrict')
						->onUpdate('restrict');
		});
		Schema::table('occurence_specifications', function(Blueprint $table) {
			$table->foreign('lifeline_id')->references('id')->on('lifelines')
						->onDelete('restrict')
						->onUpdate('restrict');
		});
	}

	public function down()
	{
		Schema::table('messages', function(Blueprint $table) {
			$table->dropForeign('messages_interaction_id_foreign');
		});
		Schema::table('messages', function(Blueprint $table) {
			$table->dropForeign('messages_send_event_id_foreign');
		});
		Schema::table('messages', function(Blueprint $table) {
			$table->dropForeign('messages_receive_event_id_foreign');
		});
		Schema::table('interaction_fragments', function(Blueprint $table) {
			$table->dropForeign('interaction_fragments_enclosing_fragment_id_foreign');
		});
		Schema::table('execution_specifications', function(Blueprint $table) {
			$table->dropForeign('execution_specifications_start_occurence_specification_id_foreign');
		});
		Schema::table('execution_specifications', function(Blueprint $table) {
			$table->dropForeign('execution_specifications_finish_occurence_specification_id_foreign');
		});
		Schema::table('occurence_specifications', function(Blueprint $table) {
			$table->dropForeign('occurence_specifications_lifeline_id_foreign');
		});
	}
}