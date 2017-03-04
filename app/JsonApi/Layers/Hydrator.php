<?php

namespace App\JsonApi\Layers;

use CloudCreativity\LaravelJsonApi\Hydrator\EloquentHydrator;

class Hydrator extends EloquentHydrator
{
    /**
     * @var array
     */
    protected $attributes = [
        'name',
        'depth',
    ];

    /**
     * @var array
     */
    protected $relationships = [
        //
    ];

    // TODO
    // protected function hydrateRelationshipsLifelines(RelationshipInterface $relationship, $record) {
    // }
}
