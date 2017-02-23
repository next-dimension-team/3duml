<?php

namespace App\JsonApi\Messages;

use CloudCreativity\LaravelJsonApi\Schema\EloquentSchema;

class Schema extends EloquentSchema
{

    /**
     * @var string
     */
    const RESOURCE_TYPE = 'messages';

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

