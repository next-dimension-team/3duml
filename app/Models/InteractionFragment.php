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

    // TODO: RUBY: toto som musel zakomentovať, lebo inak
    // URLka http://localhost/api/interaction-fragments vracala 500
    /*public function fragmentable()
    {
        return $this->morphTo();
    }*/
}
