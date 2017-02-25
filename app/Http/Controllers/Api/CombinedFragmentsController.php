<?php

namespace App\Http\Controllers\Api;

use App\JsonApi\CombinedFragments;
use App\Models\CombinedFragment;
use CloudCreativity\LaravelJsonApi\Http\Controllers\EloquentController;
use CloudCreativity\LaravelJsonApi\Search\SearchAll;

final class CombinedFragmentsController extends EloquentController
{
    /**
     * CombinedFragmentsController constructor.
     *
     * @param CombinedFragments\Hydrator $hydrator
     * @param SearchAll $search
     */
    public function __construct(CombinedFragments\Hydrator $hydrator, SearchAll $search)
    {
        parent::__construct(new CombinedFragment, $hydrator, $search);
    }

    /**
     * @return string
     */
    protected function getRequestHandler()
    {
        return CombinedFragments\Request::class;
    }
}
