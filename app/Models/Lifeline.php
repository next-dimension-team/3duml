<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lifeline extends Model {

	protected $table = 'lifelines';
	public $timestamps = true;

	public function executionOccurrenceSpecification()
	{
		return $this->hasMany('ExecutionOccurrenceSpecification');
	}

	public function interaction()
	{
		return $this->belongsTo('Interaction');
	}

	public function stateInvariant()
	{
		return $this->hasMany('StateInvariant');
	}

	public function messageOccurrenceSpecification()
	{
		return $this->hasMany('MessageOccurrenceSpecifications');
	}

	public function lifelineCombinedFragment()
	{
		return $this->hasMany('LifelineCombinedFragments');
	}

	public function lifelineInteractionOperand()
	{
		return $this->hasMany('LifelineInteractionOperand');
	}

}