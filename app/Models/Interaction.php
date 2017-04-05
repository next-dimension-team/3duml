<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Interaction extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'interactions';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'name' => 'string',
    ];

    /**
     * The Messages contained in this Interaction.
     */
    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    /**
     * Specifies the participants in this Interaction.
     */
    public function lifelines()
    {
        return $this->hasMany(Lifeline::class)->orderBy('order');
    }

    /**
     * References the associated node in fragments tree.
     */
    public function fragment()
    {
        return $this->morphOne(InteractionFragment::class, 'fragmentable');
    }
}