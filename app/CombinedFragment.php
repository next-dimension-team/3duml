<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CombinedFragment extends Model {

	protected $table = 'combined_fragments';
	public $timestamps = true;

	public function lifelineCombinedFragment()
	{
		return $this->hasMany('LifelineCombinedFragments');
	}

	public function interactionOperand()
	{
		return $this->hasMany('InteractionOperand');
	}

	public function interaction()
	{
		return $this->belongsTo('Interaction');
	}

}