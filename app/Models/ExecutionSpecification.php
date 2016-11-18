<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExecutionSpecification extends Model {

	protected $table = 'execution_specifications';
	public $timestamps = true;

	public function occurenceSpecification()
	{
		return $this->hasOne('App\Models\OccurenceSpecification', 'start_occurence_specification_id');
	}

	public function occurenceSpecification()
	{
		return $this->hasOne('App\Models\OccurenceSpecification', 'finish_occurence_specification_id');
	}

	public function interactionFragments()
	{
		return $this->morphMany('App\Models\InteractionFragment', 'fragmentable');
	}

}
