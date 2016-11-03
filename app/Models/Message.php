<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model {

	protected $table = 'messages';
	public $timestamps = true;

	public function interaction()
	{
		return $this->belongsTo('Interaction');
	}

	public function messageEnd()
	{
		return $this->hasOne('MessageEnd');
	}

}