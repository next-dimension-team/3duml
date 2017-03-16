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
     * References the concrete fragment type of current tree node.
     */
    public function fragmentable()
    {
        return $this->morphTo();
    }
}
