<?php

namespace App\Transformers;

use App\Models\Message;
use NilPortugues\Api\Mappings\JsonApiMapping;

class MessageTransformer implements JsonApiMapping
{
    /**
     * {@inheritdoc}
     */
    public function getClass()
    {
        return Message::class;
    }

    /**
     * {@inheritdoc}
     */
    public function getAlias()
    {
        return 'messages';
    }

    /**
     * {@inheritdoc}
     */
    public function getAliasedProperties()
    {
        return [];
    }

    /**
     * {@inheritdoc}
     */
    public function getHideProperties()
    {
        return [];
    }

    /**
     * {@inheritdoc}
     */
    public function getIdProperties()
    {
        return ['id'];
    }

    /**
     * {@inheritdoc}
     */
    public function getUrls()
    {
        return [
            'self' => ['name' => 'messages.show', 'as_id' => 'id'],
            'messages' => ['name' => 'messages.index'],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function getRelationships()
    {
        return [];
    }

    /**
     * List the fields that are mandatory in a persitence action (POST/PUT).
     * If empty array is returned, all fields are mandatory.
     */
    public function getRequiredProperties()
    {
        return [];
    }
}
