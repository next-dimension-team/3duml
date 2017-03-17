<?php

namespace App\JsonApi\ExecutionSpecifications;

use CloudCreativity\JsonApi\Contracts\Validators\RelationshipsValidatorInterface;
use CloudCreativity\LaravelJsonApi\Validators\AbstractValidatorProvider;
use App\JsonApi\OccurrenceSpecifications\Schema as OccurrenceSpecificationsSchema;

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
        $relationships->hasOne('start', OccurrenceSpecificationsSchema::RESOURCE_TYPE, is_null($record), false);
        $relationships->hasOne('finish', OccurrenceSpecificationsSchema::RESOURCE_TYPE, is_null($record), false);
    }
}
