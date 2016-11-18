<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateInteractionsTable extends Migration {

	public function up()
	{
		Schema::create('interactions', function(Blueprint $table) {
			$table->increments('id');
			$table->timestamp('timestamps');
			$table->string('name');
			$table->enum('visibility', array(''));
		});
	}

	public function down()
	{
		Schema::drop('interactions');
	}
}
