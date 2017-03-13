<?php

namespace App\JsonApi\OccurrenceSpecifications;

use CloudCreativity\LaravelJsonApi\Hydrator\EloquentHydrator;

class Hydrator extends EloquentHydrator
{
    /**
     * @var array
     */
    protected $attributes = [
        'time'
    ];

    /**
     * @var array
     */
    protected $relationships = [
        'covered',
 		'sendingEventMessages',
 		'receivingEventMessages',
 		'startingExecutionSpecifications',
 		'finishingExecutionSpecifications'
    ];
}
