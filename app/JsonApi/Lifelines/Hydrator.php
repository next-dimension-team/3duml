<?php

namespace App\JsonApi\Lifelines;

use CloudCreativity\LaravelJsonApi\Hydrator\EloquentHydrator;

class Hydrator extends EloquentHydrator
{
    /**
     * @var array
     */
    protected $attributes = [
        'name',
        'order',
    ];

    /**
     * @var array
     */
    protected $relationships = [
        'interaction',
    ];
}
