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
            'send-event' => [
                self::SHOW_SELF => true,
                self::SHOW_RELATED => true,
                self::DATA => isset($includeRelationships['send-event'])
                    ? $resource->sendEvent
                    : $this->createBelongsToIdentity($resource, 'sendEvent'),
            ],
            'receive-event' => [
                self::SHOW_SELF => true,
                self::SHOW_RELATED => true,
                self::DATA => isset($includeRelationships['receive-event'])
                    ? $resource->receiveEvent
                    : $this->createBelongsToIdentity($resource, 'receiveEvent'),
            ],
        ];
    }
}
