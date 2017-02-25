<?php

namespace App\Http\Controllers\Api;

use App\JsonApi\Lifelines;
use App\Models\Lifeline;
use CloudCreativity\LaravelJsonApi\Http\Controllers\EloquentController;
use CloudCreativity\LaravelJsonApi\Search\SearchAll;

final class LifelinesController extends EloquentController
{
    /**
     * LifelinesController constructor.
     *
     * @param Lifelines\Hydrator $hydrator
     * @param SearchAll $search
     */
    public function __construct(Lifelines\Hydrator $hydrator, SearchAll $search)
    {
        parent::__construct(new Lifeline, $hydrator, $search);
    }

    /**
     * @return string
     */
    protected function getRequestHandler()
    {
        return Lifelines\Request::class;
    }
}
