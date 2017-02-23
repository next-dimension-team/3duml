<?php

namespace App\JsonApi\InteractionOperands;

use App\Models\InteractionOperand;
use CloudCreativity\LaravelJsonApi\Schema\EloquentSchema;

class Schema extends EloquentSchema
{

    /**
     * @var string
     */
    const RESOURCE_TYPE = 'interaction-operands';

    /**
     * @var array
     */
    protected $attributes = [
        'name',
        'constraint',
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
        if (! $resource instanceof InteractionOperand) {
            throw new RuntimeException('Expecting an InteractionOperand model.');
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
