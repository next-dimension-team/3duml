<?php

namespace App\Transformers;

use App\Lifeline;
use NilPortugues\Api\Mappings\JsonApiMapping;

class LifelineTransformer implements JsonApiMapping
{
    /**
     * {@inheritdoc}
     */
    public function getClass()
    {
        return Lifeline::class;
    }
    /**
     * {@inheritdoc}
     */
    public function getAlias()
    {
        return 'lifeline';
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
            'self' => ['name' => 'lifelines.show', 'as_id' => 'id'],
            'lifelines' => ['name' => 'lifelines.index'],
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
