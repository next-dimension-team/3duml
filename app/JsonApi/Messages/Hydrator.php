<?php

namespace App\JsonApi\Messages;

use CloudCreativity\LaravelJsonApi\Hydrator\EloquentHydrator;

class Hydrator extends EloquentHydrator
{
    /**
     * @var array
     */
    protected $attributes = [
        'name',
		'sort'
    ];

    /**
     * @var array
     */
    protected $relationships = [
        'interaction',
 		'sendEvent',
 		'receiveEvent'
    ];
}
