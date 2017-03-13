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
     * Whether resource member names are hyphenated
     *
     * The JSON API spec recommends using hyphens for resource member names, so this package
     * uses this as the default. If you do not want to follow the recommendation, set this
     * to `false`.
     *
     * @var bool
     */
    protected $hyphenated = false;

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
            'lifelines' => [
                self::SHOW_SELF => true,
                self::SHOW_RELATED => true,
                self::DATA => $resource->lifelines,
            ],
            'fragment' => [
                self::SHOW_SELF => true,
                self::SHOW_RELATED => true,
                self::DATA => $resource->fragment,
            ],
        ];
    }
}
