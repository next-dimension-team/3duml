<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StateInvariant extends Model {

	protected $table = 'state_invariants';
	public $timestamps = true;

	public function lifeline()
	{
		return $this->belongsTo('Lifeline');
	}

}