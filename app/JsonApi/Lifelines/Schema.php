<?php

namespace App\JsonApi\Lifelines;

use App\Models\Lifeline;
use CloudCreativity\LaravelJsonApi\Schema\EloquentSchema;

class Schema extends EloquentSchema
{

    /**
     * @var string
     */
    const RESOURCE_TYPE = 'lifelines';

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
        if (! $resource instanceof Lifeline) {
            throw new RuntimeException('Expecting a Lifeline model.');
        }

        return [
            'occurrence-specifications' => [
                self::SHOW_SELF => true,
                self::SHOW_RELATED => true,
                self::DATA => $resource->occurrenceSpecifications,
            ],
            'layer' => [
                self::SHOW_SELF => true,
                self::SHOW_RELATED => true,
                self::DATA => isset($includeRelationships['layer'])
                    ? $resource->layer
                    : $this->createBelongsToIdentity($resource, 'layer'),
            ],
        ];
    }
}
