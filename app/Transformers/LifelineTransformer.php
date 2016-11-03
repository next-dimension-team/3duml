<?php

namespace App\Transformers;

use App\Models\Lifeline;
use NilPortugues\Api\Mappings\JsonApiMapping;

class LifelineTransformer implements JsonApiMapping {

    /**
     * {@inheritDoc}
     */
    public function getClass()
    {
        return Lifeline::class;
    }
    /**
     * {@inheritDoc}
     */
    public function getAlias()
    {
        return 'lifeline';
    }
    /**
     * {@inheritDoc}
     */
    public function getAliasedProperties()
    {
        return [];
    }
    /**
     * {@inheritDoc}
     */
    public function getHideProperties()
    {
        return [];
    }
    /**
     * {@inheritDoc}
     */
    public function getIdProperties()
    {
        return ['id'];
    }
    /**
     * {@inheritDoc}
     */
    public function getUrls()
    {
        return [
            'self' => ['name' => 'lifelines.show', 'as_id' => 'id'],
            'lifelines' => ['name' => 'lifelines.index'],
        ];
    }
    /**
     * {@inheritDoc}
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