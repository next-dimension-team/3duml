<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MessageEnd extends Model {

	protected $table = 'message_ends';
	public $timestamps = true;

	public function message()
	{
		return $this->belongsTo('Message');
	}

}