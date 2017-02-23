<?php

namespace App\JsonApi\Interactions;

use App\Models\Interaction;
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
        'name',
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
        if (! $resource instanceof Interaction) {
            throw new RuntimeException('Expecting an Interaction model.');
        }

        return [
            'messages' => [
                self::SHOW_SELF => true,
                self::SHOW_RELATED => true,
                self::DATA => $resource->messages,
            ],
            'fragment' => [
                self::SHOW_SELF => true,
                self::SHOW_RELATED => true,
                self::DATA => $resource->fragment,
            ],
        ];
    }
}
