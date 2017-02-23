<?php

namespace App\JsonApi\Layers;

use App\Models\Layer;
use CloudCreativity\LaravelJsonApi\Schema\EloquentSchema;

class Schema extends EloquentSchema
{
    /**
     * @var string
     */
    const RESOURCE_TYPE = 'layers';

    /**
     * @var array
     */
    protected $attributes = [
        'depth',
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
        if (! $resource instanceof Layer) {
            throw new RuntimeException('Expecting a Layer model.');
        }

        return [
            'lifelines' => [
                self::SHOW_SELF => true,
                self::SHOW_RELATED => true,
                self::DATA => $resource->lifelines,
            ],
        ];
    }
}
