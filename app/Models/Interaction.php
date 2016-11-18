<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Interaction extends Model
{
    protected $table = 'interactions';
    public $timestamps = true;

    public function messages()
    {
        return $this->hasMany('App\Models\Message', 'interaction_id');
    }

    public function interactionFragments()
    {
        return $this->morphMany('App\Models\InteractionFragment', 'fragmentable');
    }

    public function lifelines()
    {
        return $this->hasMany('App\Models\Lifeline');
    }
}
