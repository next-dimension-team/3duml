<?php

namespace App\JsonApi\InteractionFragments;

use App\Models\InteractionFragment;
use CloudCreativity\LaravelJsonApi\Schema\EloquentSchema;

class Schema extends EloquentSchema
{
    /**
     * @var string
     */
    const RESOURCE_TYPE = 'interaction-fragments';

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

    /**
     * @param object $resource
     * @param bool $isPrimary
     * @param array $includeRelationships
     * @return array
     */
    public function getRelationships($resource, $isPrimary, array $includeRelationships)
    {
        if (! $resource instanceof InteractionFragment) {
            throw new RuntimeException('Expecting an InteractionFragment model.');
        }

        return [
            'fragmentable' => [
                self::SHOW_SELF => true,
                self::SHOW_RELATED => true,
                self::DATA => $resource->fragmentable,
            ],
            'parent' => [
                self::SHOW_SELF => true,
                self::SHOW_RELATED => true,
                self::DATA => isset($includeRelationships['parent'])
                    ? $resource->parent
                    : $this->createBelongsToIdentity($resource, 'parent'),
            ],
            'children' => [
                self::SHOW_SELF => true,
                self::SHOW_RELATED => true,
                self::DATA => $resource->children,
            ],
        ];
    }
}
