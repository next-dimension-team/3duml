<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'messages';

    public function interaction()
    {
        return $this->belongsTo(Interaction::class);
    }

    public function sendEvent()
    {
        return $this->belongsTo(OccurenceSpecification::class, 'send_event_id');
    }

    public function receiveEvent()
    {
        return $this->belongsTo(OccurenceSpecification::class, 'receive_event_id');
    }
}
