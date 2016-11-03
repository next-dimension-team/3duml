<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MessageOccurrenceSpecifications extends Model {

	protected $table = 'message_occurrence_specifications';
	public $timestamps = true;

	public function lifelines()
	{
		return $this->belongsTo('Lifeline');
	}

}