<?php

namespace App\JsonApi\Messages;

use CloudCreativity\JsonApi\Contracts\Validators\RelationshipsValidatorInterface;
use CloudCreativity\LaravelJsonApi\Validators\AbstractValidatorProvider;
use App\JsonApi\Interactions\Schema as InteractionsSchema;
use App\JsonApi\OccurrenceSpecifications\Schema as OccurrenceSpecificationsSchema;
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
        $required = ! is_null($record) ? ['sometimes', 'required'] : ['required'];

        return [
            'name' => array_merge($required, [
                'string',
                'between:1,255',
            ]),
            'sort' => array_merge($required, [
                'string',
                 Rule::in(['synchCall', 'asynchCall', 'asynchSignal', 'createMessage', 'deleteMessage', 'reply']),
            ]),
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
        $relationships->hasOne('interaction', InteractionsSchema::RESOURCE_TYPE, is_null($record), false);
        $relationships->hasOne('sendEvent', OccurrenceSpecificationsSchema::RESOURCE_TYPE, is_null($record), true);
        $relationships->hasOne('receiveEvent', OccurrenceSpecificationsSchema::RESOURCE_TYPE, is_null($record), true);
    }
}
