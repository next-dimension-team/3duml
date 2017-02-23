<?php

namespace App\Http\Controllers\Api;

use App\JsonApi\ExecutionSpecifications;
use App\Models\ExecutionSpecification;
use CloudCreativity\LaravelJsonApi\Http\Controllers\EloquentController;
use CloudCreativity\LaravelJsonApi\Search\SearchAll;

final class ExecutionSpecificationsController extends EloquentController
{

    /**
     * ExecutionSpecificationsController constructor.
     *
     * @param ExecutionSpecifications\Hydrator $hydrator
     * @param SearchAll $search
     */
    public function __construct(ExecutionSpecifications\Hydrator $hydrator, SearchAll $search)
    {
        parent::__construct(new ExecutionSpecification, $hydrator, $search);
    }

    /**
     * @return string
     */
    protected function getRequestHandler()
    {
        return ExecutionSpecifications\Request::class;
    }

}
