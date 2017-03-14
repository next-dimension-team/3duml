<?php

namespace App\JsonApi\CombinedFragments;

use CloudCreativity\LaravelJsonApi\Hydrator\EloquentHydrator;

class Hydrator extends EloquentHydrator
{
    /**
     * @var array
     */
    protected $attributes = [
        'name',
		'operator',
    ];

    /**
     * @var array
     */
    protected $relationships = [
        'fragmentable',
    ];
}
