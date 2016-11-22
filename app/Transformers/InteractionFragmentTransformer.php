<?php

namespace App\Transformers;

use App\Models\InteractionFragment;
use NilPortugues\Api\Mappings\JsonApiMapping;

class InteractionFragmentTransformer implements JsonApiMapping
{
    /**
     * {@inheritdoc}
     */
    public function getClass()
    {
        return InteractionFragment::class;
    }

    /**
     * {@inheritdoc}
     */
    public function getAlias()
    {
        return 'interaction-fragments';
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
            'self' => ['name' => 'interaction-fragments.show', 'as_id' => 'id'],
            'interaction-fragments' => ['name' => 'interaction-fragments.index'],
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
