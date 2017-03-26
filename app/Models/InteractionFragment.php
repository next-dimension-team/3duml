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

    /**
     * The "booting" method of the model.
     *
     * @return void
     */
    protected static function boot() {
      parent::boot();

      static::deleting(function($model) {
        $model->fragmentable->delete();
      });
    }

    /**
     * References the concrete fragment type of current tree node.
     */
    public function fragmentable()
    {
        return $this->morphTo();
    }
}
