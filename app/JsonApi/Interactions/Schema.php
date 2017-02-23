<?php

namespace App\JsonApi\Interactions;

use CloudCreativity\LaravelJsonApi\Schema\EloquentSchema;

class Schema extends EloquentSchema
{

    /**
     * @var string
     */
    const RESOURCE_TYPE = 'interactions';

    /**
     * @var array
     */
    protected $attributes = [
        //
    ];

    /**
     * @return string
     */
    public function getResourceType()
    {
        return self::RESOURCE_TYPE;
    }
}

