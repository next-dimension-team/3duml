<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InteractionFragment extends Model {

	protected $table = 'interaction_fragments';
	public $timestamps = false;

	public function interactionFragment()
	{
		return $this->hasMany('App\Models\InteractionFragment', 'enclosing_fragment_id');
	}

	public function interactionFragment()
	{
		return $this->belongsTo('App\Models\InteractionFragment', 'enclosing_fragment_id');
	}

	public function fragmentable()
	{
		return $this->morphTo();
	}

}
