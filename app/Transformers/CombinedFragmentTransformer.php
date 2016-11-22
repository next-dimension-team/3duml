<?php

namespace App\Transformers;

use App\Models\CombinedFragment;
use NilPortugues\Api\Mappings\JsonApiMapping;

class CombinedFragmentTransformer implements JsonApiMapping
{
    /**
     * {@inheritdoc}
     */
    public function getClass()
    {
        return CombinedFragment::class;
    }

    /**
     * {@inheritdoc}
     */
    public function getAlias()
    {
        return 'combined-fragments';
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
            'self' => ['name' => 'combined-fragments.show', 'as_id' => 'id'],
            'combined-fragments' => ['name' => 'combined-fragments.index'],
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
