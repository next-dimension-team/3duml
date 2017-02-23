<?php

namespace App\JsonApi\OccurrenceSpecifications;

use App\Models\OccurrenceSpecification;
use CloudCreativity\LaravelJsonApi\Schema\EloquentSchema;

class Schema extends EloquentSchema
{
    /**
     * @var string
     */
    const RESOURCE_TYPE = 'occurrence-specifications';

    /**
     * @var array
     */
    protected $attributes = [
        'time',
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
        if (! $resource instanceof OccurrenceSpecification) {
            throw new RuntimeException('Expecting an OccurrenceSpecification model.');
        }

        return [
            'covered' => [
                self::SHOW_SELF => true,
                self::SHOW_RELATED => true,
                self::DATA => isset($includeRelationships['covered'])
                    ? $resource->covered
                    : $this->createBelongsToIdentity($resource, 'covered'),
            ],
            'sending-event-messages' => [
                self::SHOW_SELF => true,
                self::SHOW_RELATED => true,
                self::DATA => $resource->sendingEventMessages,
            ],
            'receiving-event-messages' => [
                self::SHOW_SELF => true,
                self::SHOW_RELATED => true,
                self::DATA => $resource->receivingEventMessages,
            ],
            'starting-execution-specifications' => [
                self::SHOW_SELF => true,
                self::SHOW_RELATED => true,
                self::DATA => $resource->startingExecutionSpecifications,
            ],
            'finishing-execution-specifications' => [
                self::SHOW_SELF => true,
                self::SHOW_RELATED => true,
                self::DATA => $resource->finishingExecutionSpecifications,
            ],
        ];
    }
}
