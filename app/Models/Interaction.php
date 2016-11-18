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

    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    public function fragment()
    {
        return $this->morphOne(InteractionFragment::class, 'fragmentable');
    }
}
