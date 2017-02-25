<?php

namespace App\Http\Controllers\Api;

use App\JsonApi\Interactions;
use App\Models\Interaction;
use CloudCreativity\LaravelJsonApi\Http\Controllers\EloquentController;
use CloudCreativity\LaravelJsonApi\Search\SearchAll;

final class InteractionsController extends EloquentController
{
    /**
     * InteractionsController constructor.
     *
     * @param Interactions\Hydrator $hydrator
     * @param SearchAll $search
     */
    public function __construct(Interactions\Hydrator $hydrator, SearchAll $search)
    {
        parent::__construct(new Interaction, $hydrator, $search);
    }

    /**
     * @return string
     */
    protected function getRequestHandler()
    {
        return Interactions\Request::class;
    }
}
