<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OccurenceSpecification extends Model {

	protected $table = 'occurence_specifications';
	public $timestamps = true;

	public function message()
	{
		return $this->belongsTo('App\Models\Message', 'send_event_id');
	}

	public function message()
	{
		return $this->belongsTo('App\Models\Message', 'receive_event_id');
	}

	public function lifeline()
	{
		return $this->belongsTo('App\Models\Lifeline', 'lifeline_id');
	}

	public function startExecutionSpecification()
	{
		return $this->belongsTo('App\Models\ExecutionSpecification', 'start_occurence_specification_id');
	}

	public function finishExecutionSpecification()
	{
		return $this->belongsTo('App\Models\ExecutionSpecification', 'finish_occurence_specification_id');
	}

}
