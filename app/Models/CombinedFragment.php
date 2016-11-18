<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CombinedFragment extends Model
{
    protected $table = 'combined_fragments';
    public $timestamps = true;

    public function interactionFragments()
    {
        return $this->morphMany('App\Models\InteractionFragment', 'fragmentable');
    }

    public function interactionOperands()
    {
        return $this->hasMany('App\Models\InteractionOperand');
    }
}
