<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model {

	protected $table = 'messages';
	public $timestamps = false;

	public function interaction()
	{
		return $this->belongsTo('App\Models\Interaction', 'interaction_id');
	}

	public function occurenceSpecification()
	{
		return $this->hasOne('App\Models\OccurenceSpecification', 'send_event_id');
	}

	public function occurenceSpecification()
	{
		return $this->hasOne('App\Models\OccurenceSpecification', 'receive_event_id');
	}

}
