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

    public function start()
    {
        return $this->belongsTo(OccurenceSpecification::class, 'start_occurence_specification_id');
    }

    public function finish()
    {
        return $this->belongsTo(OccurenceSpecification::class, 'finish_occurence_specification_id');
    }

    public function fragment()
    {
        return $this->morphOne(InteractionFragment::class, 'fragmentable');
    }
}
