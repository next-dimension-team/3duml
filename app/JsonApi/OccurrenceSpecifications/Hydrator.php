<?php

namespace App\JsonApi\OccurrenceSpecifications;

use CloudCreativity\LaravelJsonApi\Hydrator\EloquentHydrator;

class Hydrator extends EloquentHydrator
{
    /**
     * @var array
     */
    protected $attributes = [
        'time',
    ];

    /**
     * @var array
     */
    protected $relationships = [
        'covered',
<<<<<<< HEAD
 		'sendingEventMessages',
 		'receivingEventMessages',
 		'startingExecutionSpecifications',
 		'finishingExecutionSpecifications',
=======
        'sendingEventMessages',
        'receivingEventMessages',
        'startingExecutionSpecifications',
        'finishingExecutionSpecifications'
>>>>>>> 783c39b376a5d5d52073a1d870a2f6ab1e3aac40
    ];
}
