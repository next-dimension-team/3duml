<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InteractionOperand extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'interaction_operands';

    /**
    * The fragments of the operand.
    */
    public function fragment()
    {
        return $this->morphOne(InteractionFragment::class, 'fragmentable');
    }
}
