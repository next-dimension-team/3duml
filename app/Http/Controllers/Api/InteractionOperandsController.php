<?php

namespace App\Http\Controllers\Api;

use App\JsonApi\InteractionOperands;
use App\Models\InteractionOperand;
use CloudCreativity\LaravelJsonApi\Http\Controllers\EloquentController;
use CloudCreativity\LaravelJsonApi\Search\SearchAll;

final class InteractionOperandsController extends EloquentController
{

    /**
     * InteractionOperandsController constructor.
     *
     * @param InteractionOperands\Hydrator $hydrator
     * @param SearchAll $search
     */
    public function __construct(InteractionOperands\Hydrator $hydrator, SearchAll $search)
    {
        parent::__construct(new InteractionOperand, $hydrator, $search);
    }

    /**
     * @return string
     */
    protected function getRequestHandler()
    {
        return InteractionOperands\Request::class;
    }

}
