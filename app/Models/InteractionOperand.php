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
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'constraint',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'name' => 'string',
        'constraint' => 'string',
    ];

    /**
     * References the associated node in fragments tree.
     */
    public function fragment()
    {
        return $this->morphOne(InteractionFragment::class, 'fragmentable');
    }
}
