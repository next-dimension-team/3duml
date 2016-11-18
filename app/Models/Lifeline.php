<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lifeline extends Model {

	protected $table = 'lifelines';
	public $timestamps = false;

	public function occurenceSpecifications()
	{
		return $this->hasMany('App\Models\OccurenceSpecification', 'lifeline_id');
	}

	public function interaction()
	{
		return $this->belongsTo('App\Models\Interaction');
	}

}