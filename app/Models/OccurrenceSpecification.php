<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OccurrenceSpecification extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'occurrence_specifications';
	
	protected $fillable = [
        'time'
    ];

    public function covered()
    {
        return $this->belongsTo(Lifeline::class, 'lifeline_id');
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
        return $this->hasMany(ExecutionSpecification::class, 'start_occurrence_specification_id');
    }

    public function finishingExecutionSpecifications()
    {
        return $this->hasMany(ExecutionSpecification::class, 'finish_occurrence_specification_id');
    }
}
