<?php

namespace App\JsonApi\CombinedFragments;

use CloudCreativity\JsonApi\Contracts\Validators\RelationshipsValidatorInterface;
use CloudCreativity\LaravelJsonApi\Validators\AbstractValidatorProvider;
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
            'operator' => array_merge($required, [
                'string',
                 Rule::in(['alt', 'opt', 'par', 'loop', 'critical', 'neg', 'assert', 'strict', 'seq', 'ignore', 'consider']),
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
        //
    }
}
