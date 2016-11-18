<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OccurenceSpecification extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'occurence_specifications';

    public function covered()
    {
        return $this->belongsTo(Lifeline::class);
    }

    public function sendingEventMessages()
    {
        return $this->hasMany(Message::class, 'send_event_id');
    }

    public function receivingEventMessages()
    {
        return $this->hasMany(Message::class, 'receive_event_id');
    }

    public function startingExecutionSpecifications()
    {
        return $this->hasMany(ExecutionSpecification::class, 'start_occurence_specification_id');
    }

    public function finishingExecutionSpecifications()
    {
        return $this->hasMany(ExecutionSpecification::class, 'finish_occurence_specification_id');
    }
}
