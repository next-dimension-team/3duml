<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CombinedFragment extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'combined_fragments';

    /**
     *
     */
    public function fragment()
    {
        return $this->morphOne(InteractionFragment::class, 'fragmentable');
    }
}
