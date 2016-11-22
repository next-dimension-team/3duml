<?php

namespace App\Transformers;

use App\Models\OccurrenceSpecification;
use NilPortugues\Api\Mappings\JsonApiMapping;

class OccurrenceSpecificationTransformer implements JsonApiMapping
{
    /**
     * {@inheritdoc}
     */
    public function getClass()
    {
        return OccurrenceSpecification::class;
    }

    /**
     * {@inheritdoc}
     */
    public function getAlias()
    {
        return 'occurrence-specifications';
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
            'self' => ['name' => 'occurrence-specifications.show', 'as_id' => 'id'],
            'occurrence-specifications' => ['name' => 'occurrence-specifications.index'],
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
