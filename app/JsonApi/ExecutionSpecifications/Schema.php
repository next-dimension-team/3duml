<?php

namespace App\JsonApi\ExecutionSpecifications;

use App\Models\ExecutionSpecification;
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
        if (! $resource instanceof ExecutionSpecification) {
            throw new RuntimeException('Expecting an ExecutionSpecification model.');
        }

        return [
            'start' => [
                self::SHOW_SELF => true,
                self::SHOW_RELATED => true,
                self::DATA => isset($includeRelationships['start'])
                    ? $resource->start
                    : $this->createBelongsToIdentity($resource, 'start'),
            ],
            'finish' => [
                self::SHOW_SELF => true,
                self::SHOW_RELATED => true,
                self::DATA => isset($includeRelationships['finish'])
                    ? $resource->finish
                    : $this->createBelongsToIdentity($resource, 'finish'),
            ],
            'fragment' => [
                self::SHOW_SELF => true,
                self::SHOW_RELATED => true,
                self::DATA => $resource->fragment,
            ],
        ];
    }
}
