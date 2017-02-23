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
            'sendingEventMessages' => [
                self::SHOW_SELF => true,
                self::SHOW_RELATED => true,
                self::DATA => $resource->sendingEventMessages,
            ],
            'receivingEventMessages' => [
                self::SHOW_SELF => true,
                self::SHOW_RELATED => true,
                self::DATA => $resource->receivingEventMessages,
            ],
            'startingExecutionSpecifications' => [
                self::SHOW_SELF => true,
                self::SHOW_RELATED => true,
                self::DATA => $resource->startingExecutionSpecifications,
            ],
            'finishingExecutionSpecifications' => [
                self::SHOW_SELF => true,
                self::SHOW_RELATED => true,
                self::DATA => $resource->finishingExecutionSpecifications,
            ],
        ];
    }
}
