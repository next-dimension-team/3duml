<?php

namespace App\Transformers;

use App\Models\Layer;
use NilPortugues\Api\Mappings\JsonApiMapping;

class LayerTransformer implements JsonApiMapping
{
    /**
     * {@inheritdoc}
     */
    public function getClass()
    {
        return Layer::class;
    }

    /**
     * {@inheritdoc}
     */
    public function getAlias()
    {
        return 'layers';
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
            'self' => ['name' => 'layers.show', 'as_id' => 'id'],
            'layers' => ['name' => 'layers.index'],
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
