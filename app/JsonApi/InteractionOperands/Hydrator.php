<?php

namespace App\JsonApi\InteractionOperands;

use CloudCreativity\LaravelJsonApi\Hydrator\EloquentHydrator;

class Hydrator extends EloquentHydrator
{
    /**
     * @var array
     */
    protected $attributes = [
        'name',
        'constraint',
    ];

    /**
     * @var array
     */
    protected $relationships = [
        //
    ];
}
