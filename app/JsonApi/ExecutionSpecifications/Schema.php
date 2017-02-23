<?php

namespace App\JsonApi\ExecutionSpecifications;

use CloudCreativity\LaravelJsonApi\Schema\EloquentSchema;

class Schema extends EloquentSchema
{

    /**
     * @var string
     */
    const RESOURCE_TYPE = 'execution-specifications';

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
