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

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'order',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'name' => 'string',
        'order' => 'integer',
    ];

    /**
     * References all OccurrenceSpecifications contained on this lifeline.
     */
    public function occurrenceSpecifications()
    {
        return $this->hasMany(OccurrenceSpecification::class)->orderBy('time');
    }

    /**
     * References the Interaction enclosing this Lifeline.
     */
    public function interaction()
    {
        return $this->belongsTo(Interaction::class);
    }
}
