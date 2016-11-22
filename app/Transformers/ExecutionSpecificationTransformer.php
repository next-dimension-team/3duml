<?php

namespace App\Transformers;

use App\Models\ExecutionSpecification;
use NilPortugues\Api\Mappings\JsonApiMapping;

class ExecutionSpecificationTransformer implements JsonApiMapping
{
    /**
     * {@inheritdoc}
     */
    public function getClass()
    {
        return ExecutionSpecification::class;
    }

    /**
     * {@inheritdoc}
     */
    public function getAlias()
    {
        return 'execution-specifications';
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
            'self' => ['name' => 'execution-specifications.show', 'as_id' => 'id'],
            'execution-specifications' => ['name' => 'execution-specifications.index'],
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
