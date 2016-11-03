<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Interaction extends Model {

	protected $table = 'interactions';
	public $timestamps = true;

	public function lifeline()
	{
		return $this->hasMany('Lifeline');
	}

	public function message()
	{
		return $this->hasMany('Message');
	}

	public function combinedFragment()
	{
		return $this->hasMany('CombinedFragment');
	}

}