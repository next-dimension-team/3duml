<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InteractionOperand extends Model {

	protected $table = 'interaction_operands';
	public $timestamps = true;

	public function lifelineInteractionOperand()
	{
		return $this->hasMany('LifelineInteractionOperand');
	}

	public function combinedFragment()
	{
		return $this->belongsTo('CombinedFragment');
	}

}