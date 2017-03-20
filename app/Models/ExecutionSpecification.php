<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExecutionSpecification extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'execution_specifications';

    /**
     * References the OccurrenceSpecification that designates
     * the start of the Action or Behavior.
     */
    public function start()
    {
        return $this->belongsTo(OccurrenceSpecification::class, 'start_occurrence_specification_id');
    }

    /**
     * References the OccurrenceSpecification that designates
     * the finish of the Action or Behavior.
     */
    public function finish()
    {
        return $this->belongsTo(OccurrenceSpecification::class, 'finish_occurrence_specification_id');
    }

    /**
     * References the associated node in fragments tree.
     */
    public function fragment()
    {
        return $this->morphOne(InteractionFragment::class, 'fragmentable');
    }
}
