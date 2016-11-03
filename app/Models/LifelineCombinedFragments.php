<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LifelineCombinedFragments extends Model {

	protected $table = 'lifelines_combined_fragments';
	public $timestamps = true;

	public function lifeline()
	{
		return $this->belongsTo('Lifeline');
	}

	public function combinedFragment()
	{
		return $this->belongsTo('CombinedFragment');
	}

}