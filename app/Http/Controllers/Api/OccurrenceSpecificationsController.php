<?php

namespace App\Http\Controllers\Api;

use App\JsonApi\OccurrenceSpecifications;
use App\Models\OccurrenceSpecification;
use CloudCreativity\LaravelJsonApi\Http\Controllers\EloquentController;
use CloudCreativity\LaravelJsonApi\Search\SearchAll;

final class OccurrenceSpecificationsController extends EloquentController
{

    /**
     * OccurrenceSpecificationsController constructor.
     *
     * @param OccurrenceSpecifications\Hydrator $hydrator
     * @param SearchAll $search
     */
    public function __construct(OccurrenceSpecifications\Hydrator $hydrator, SearchAll $search)
    {
        parent::__construct(new OccurrenceSpecification, $hydrator, $search);
    }

    /**
     * @return string
     */
    protected function getRequestHandler()
    {
        return OccurrenceSpecifications\Request::class;
    }

}
