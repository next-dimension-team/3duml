<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LifelineInteractionOperand extends Model {

	protected $table = 'lifelines_interaction_operands';
	public $timestamps = true;

	public function lifeline()
	{
		return $this->belongsTo('Lifeline');
	}

	public function interactionOperand()
	{
		return $this->belongsTo('InteractionOperand');
	}

}