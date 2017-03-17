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

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'time',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'time' => 'integer',
    ];

    /**
     * References the Lifeline on which the OccurrenceSpecification appears.
     */
    public function covered()
    {
        return $this->belongsTo(Lifeline::class, 'lifeline_id');
    }

    /**
     * Retrieve all messages which are starting from this OccurrenceSpecification.
     */
    public function sendingEventMessages()
    {
        return $this->hasMany(Message::class, 'send_event_id');
    }

    /**
     * Retrieve all messages which are finishing in this OccurrenceSpecification.
     */
    public function receivingEventMessages()
    {
        return $this->hasMany(Message::class, 'receive_event_id');
    }

    /**
     * Retrieve all ExecutionSpecifications which are starting from this OccurrenceSpecification.
     */
    public function startingExecutionSpecifications()
    {
        return $this->hasMany(ExecutionSpecification::class, 'start_occurrence_specification_id');
    }

    /**
     * Retrieve all ExecutionSpecifications which are finishing in this OccurrenceSpecification.
     */
    public function finishingExecutionSpecifications()
    {
        return $this->hasMany(ExecutionSpecification::class, 'finish_occurrence_specification_id');
    }
}
