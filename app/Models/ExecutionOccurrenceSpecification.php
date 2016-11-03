<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExecutionOccurrenceSpecification extends Model {

	protected $table = 'execution_occurrence_specifications';
	public $timestamps = true;

	public function lifeline()
	{
		return $this->belongsTo('Lifeline');
	}

}