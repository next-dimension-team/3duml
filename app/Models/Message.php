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

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['kind'];

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

    /**
     * Get kind of a message.
     *
     * @return string
     */
    public function getKindAttribute()
    {
        if (isset($this->attributes['send_event_id']) && isset($this->attributes['receive_event_id'])) {
            return 'complete';
        }

        if (isset($this->attributes['send_event_id'])) {
            return 'lost';
        }

        if (isset($this->attributes['receive_event_id'])) {
            return 'found';
        }

        return 'unknown';
    }

    /**
     * Prevent setting kind of a message.
     *
     * @param  string  $value
     * @return void
     */
    public function setKindAttribute($value)
    {
        //
    }
}
