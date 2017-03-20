<?php

namespace App\JsonApi\OccurrenceSpecifications;

use CloudCreativity\JsonApi\Contracts\Validators\RelationshipsValidatorInterface;
use CloudCreativity\LaravelJsonApi\Validators\AbstractValidatorProvider;
use App\JsonApi\Lifelines\Schema as LifelinesSchema;
use Illuminate\Validation\Rule;

class Validators extends AbstractValidatorProvider
{
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
        $required = ! is_null($record) ? 'sometimes|required' : 'required';

        return [
            'time' => "{$required}|integer|min:1",
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
        $relationships->hasOne('covered', LifelinesSchema::RESOURCE_TYPE, is_null($record), false);
    }
}
