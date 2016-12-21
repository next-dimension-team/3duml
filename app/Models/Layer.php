<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Layer extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'layers';

    public function lifelines()
    {
        return $this->hasMany(Lifeline::class);
    }
}
