<?php

namespace App\JsonApi\InteractionFragments;

use CloudCreativity\JsonApi\Contracts\Validators\RelationshipsValidatorInterface;
use CloudCreativity\LaravelJsonApi\Validators\AbstractValidatorProvider;
use App\JsonApi\Interactions\Schema as InteractionsSchema;
use App\JsonApi\InteractionOperands\Schema as InteractionOperandsSchema;
use App\JsonApi\ExecutionSpecifications\Schema as ExecutionSpecificationsSchema;
use App\JsonApi\CombinedFragments\Schema as CombinedFragmentsSchema;

class Validators extends AbstractValidatorProvider
{
    /**
     * @var array
     */
    protected $filterRules = [
        'roots' => 'sometimes|required|boolean',
        'descendants' => 'sometimes|required|exists:interaction_fragments,id',
    ];

    /**
     * Get the validation rules for the resource attributes.
     *
     * @param string $resourceType
     *      the resource type being validated
     * @param object|null $record
     *      the record being updated, or null if it is a create request.
     * @return array
     */
    protected function attributeRules($resourceType, $record = null)
    {
        return [
            //
        ];
    }

    /**
     * Define the validation rules for the resource relationships.
     *
     * @param RelationshipsValidatorInterface $relationships
     * @param string $resourceType
     *      the resource type being validated
     * @param object|null $record
     *      the record being updated, or null if it is a create request.
     * @return void
     */
    protected function relationshipRules(RelationshipsValidatorInterface $relationships, $resourceType, $record = null)
    {
        $relationships->hasOne('fragmentable', [
            InteractionsSchema::RESOURCE_TYPE,
            InteractionOperandsSchema::RESOURCE_TYPE,
            ExecutionSpecificationsSchema::RESOURCE_TYPE,
            CombinedFragmentsSchema::RESOURCE_TYPE,
        ], is_null($record), false);

        $relationships->hasOne('parent', $resourceType, false, true);
    }
}
