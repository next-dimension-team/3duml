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
     * The Messages contained in this Interaction.
     */
    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    /**
     * The ordered set of fragments in the Interaction.
     */
    public function fragment()
    {
        return $this->morphOne(InteractionFragment::class, 'fragmentable');
    }
}
