<?php

namespace App\JsonApi\InteractionFragments;

use CloudCreativity\LaravelJsonApi\Hydrator\EloquentHydrator;

class Hydrator extends EloquentHydrator
{
    /**
     * @var array
     */
    protected $attributes = [
        //
    ];

    /**
     * @var array
     */
    protected $relationships = [
        'fragmentable'
    ];
}
