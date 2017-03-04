<?php

namespace App\Http\Controllers\Api;

use App\JsonApi\InteractionFragments;
use App\Models\InteractionFragment;
use CloudCreativity\LaravelJsonApi\Http\Controllers\EloquentController;

final class InteractionFragmentsController extends EloquentController
{
    /**
     * InteractionFragmentsController constructor.
     *
     * @param InteractionFragments\Hydrator $hydrator
     * @param SearchAll $search
     */
    public function __construct(InteractionFragments\Hydrator $hydrator, InteractionFragments\Search $search)
    {
        parent::__construct(new InteractionFragment, $hydrator, $search);
    }

    /**
     * @return string
     */
    protected function getRequestHandler()
    {
        return InteractionFragments\Request::class;
    }
}
