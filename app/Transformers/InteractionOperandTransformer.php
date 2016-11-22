<?php

namespace App\Transformers;

use App\Models\InteractionOperand;
use NilPortugues\Api\Mappings\JsonApiMapping;

class InteractionOperandTransformer implements JsonApiMapping
{
    /**
     * {@inheritdoc}
     */
    public function getClass()
    {
        return InteractionOperand::class;
    }

    /**
     * {@inheritdoc}
     */
    public function getAlias()
    {
        return 'interaction-operands';
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
            'self' => ['name' => 'interaction-operands.show', 'as_id' => 'id'],
            'interaction-operands' => ['name' => 'interaction-operands.index'],
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
