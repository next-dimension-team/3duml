<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lifeline extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'lifelines';

    public function occurenceSpecifications()
    {
        return $this->hasMany(OccurenceSpecification::class);
    }
}
