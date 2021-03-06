<?php

namespace App\JsonApi\Messages;

use App\Models\Message;
use CloudCreativity\LaravelJsonApi\Schema\EloquentSchema;

class Schema extends EloquentSchema
{
    /**
     * @var string
     */
    const RESOURCE_TYPE = 'messages';

    /**
     * @var array
     */
    protected $attributes = [
        'name',
        'sort',
        'kind',
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
        if (! $resource instanceof Message) {
            throw new RuntimeException('Expecting a Message model.');
        }

        return [
            'interaction' => [
                self::SHOW_SELF => true,
                self::SHOW_RELATED => true,
                self::DATA => isset($includeRelationships['interaction'])
                    ? $resource->interaction
                    : $this->createBelongsToIdentity($resource, 'interaction'),
            ],
            'sendEvent' => [
                self::SHOW_SELF => true,
                self::SHOW_RELATED => true,
                self::DATA => isset($includeRelationships['sendEvent'])
                    ? $resource->sendEvent
                    : $this->createBelongsToIdentity($resource, 'sendEvent'),
            ],
            'receiveEvent' => [
                self::SHOW_SELF => true,
                self::SHOW_RELATED => true,
                self::DATA => isset($includeRelationships['receiveEvent'])
                    ? $resource->receiveEvent
                    : $this->createBelongsToIdentity($resource, 'receiveEvent'),
            ],
        ];
    }
}
