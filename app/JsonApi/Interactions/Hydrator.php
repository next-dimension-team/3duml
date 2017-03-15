<?php

namespace App\JsonApi\Interactions;

use CloudCreativity\LaravelJsonApi\Hydrator\EloquentHydrator;

class Hydrator extends EloquentHydrator
{
    /**
     * @var array
     */
    protected $attributes = [
        'name'
    ];

    /**
     * @var array
     */
    protected $relationships = [
        'messages',
        'lifelines',
        'fragment'
    ];
}
