<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InteractionFragment extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'interaction_fragments';

    public function fragmentable()
    {
        return $this->morphTo();
    }
}
