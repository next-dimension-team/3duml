<?php

namespace App\Http\Controllers\Api;

use App\JsonApi\Layers;
use App\Models\Layer;
use CloudCreativity\LaravelJsonApi\Http\Controllers\EloquentController;
use CloudCreativity\LaravelJsonApi\Search\SearchAll;

final class LayersController extends EloquentController
{

    /**
     * LayersController constructor.
     *
     * @param Layers\Hydrator $hydrator
     * @param SearchAll $search
     */
    public function __construct(Layers\Hydrator $hydrator, SearchAll $search)
    {
        parent::__construct(new Layer, $hydrator, $search);
    }

    /**
     * @return string
     */
    protected function getRequestHandler()
    {
        return Layers\Request::class;
    }

}
