<?php

namespace App\Models;

use Baum\Node;

class InteractionFragment extends Node
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'interaction_fragments';

    public function fragmentable()
    {
        return $this->morphTo();
    }

    // TODO: docasny fix
    /**
    * Parent relation (self-referential) 1-1.
    *
    * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
    */
    public function parent() {
        return $this->belongsTo(get_class($this), $this->getParentColumnName());
    }

    /**
    * Children relation (self-referential) 1-N.
    *
    * @return \Illuminate\Database\Eloquent\Relations\HasMany
    */
    public function children() {
        return $this->hasMany(get_class($this), $this->getParentColumnName())
                    ->orderBy($this->getOrderColumnName());
    }
}
