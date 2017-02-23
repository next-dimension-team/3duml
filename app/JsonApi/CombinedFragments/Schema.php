<?php

namespace App\JsonApi\CombinedFragments;

use App\Models\CombinedFragment;
use CloudCreativity\LaravelJsonApi\Schema\EloquentSchema;

class Schema extends EloquentSchema
{
    /**
     * @var string
     */
    const RESOURCE_TYPE = 'combined-fragments';

    /**
     * @var array
     */
    protected $attributes = [
        'name',
        'operator'
    ];

    /**
     * @return string
     */
    public function getResourceType()
    {
        return self::RESOURCE_TYPE;
    }

    /**
     * @param object $resource
     * @param bool $isPrimary
     * @param array $includeRelationships
     * @return array
     */
    public function getRelationships($resource, $isPrimary, array $includeRelationships)
    {
        if (! $resource instanceof CombinedFragment) {
            throw new RuntimeException('Expecting a CombinedFragment model.');
        }

        return [
            'fragment' => [
                self::SHOW_SELF => true,
                self::SHOW_RELATED => true,
                self::DATA => $resource->fragment,
            ],
        ];
    }
}
