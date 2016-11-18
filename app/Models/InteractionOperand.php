<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InteractionOperand extends Model
{
    protected $table = 'interaction_operands';
    public $timestamps = false;

    public function interactionFragments()
    {
        return $this->morphMany('App\Models\InteractionFragment', 'fragmentable');
    }

    public function combinedFragment()
    {
        return $this->belongsTo('App\Models\CombinedFragment');
    }
}
