<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateLifelinesTable extends Migration {

	public function up()
	{
		Schema::create('lifelines', function(Blueprint $table) {
			$table->increments('id');
			$table->timestamp('timestamps');
			$table->string('name');
			$table->enum('visibility', array(''));
		});
	}

	public function down()
	{
		Schema::drop('lifelines');
	}
}