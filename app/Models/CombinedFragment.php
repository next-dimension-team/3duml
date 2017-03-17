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
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'operator',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'name' => 'string',
        'operator' => 'string',
    ];

    /**
     * References the associated node in fragments tree.
     */
    public function fragment()
    {
        return $this->morphOne(InteractionFragment::class, 'fragmentable');
    }
}
