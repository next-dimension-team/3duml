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
    protected $appends = [
        'kind',
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'sort',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'name' => 'string',
        'sort' => 'string',
    ];

    /**
     * The enclosing Interaction owning the Message.
     */
    public function interaction()
    {
        return $this->belongsTo(Interaction::class);
    }

    /**
     * References the Sending of the Message.
     */
    public function sendEvent()
    {
        return $this->belongsTo(OccurrenceSpecification::class, 'send_event_id');
    }

    /**
     * References the Receiving of the Message.
     */
    public function receiveEvent()
    {
        return $this->belongsTo(OccurrenceSpecification::class, 'receive_event_id');
    }

    /**
     * Get kind of a message.
     *
     * @return string
     */
    public function getKindAttribute()
    {
        if (isset($this->attributes['send_event_id'], $this->attributes['receive_event_id'])) {
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
