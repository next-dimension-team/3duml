<?php

namespace App\Http\Controllers\Api;

use App\JsonApi\Messages;
use App\Models\Message;
use CloudCreativity\LaravelJsonApi\Http\Controllers\EloquentController;
use CloudCreativity\LaravelJsonApi\Search\SearchAll;

final class MessagesController extends EloquentController
{

    /**
     * MessagesController constructor.
     *
     * @param Messages\Hydrator $hydrator
     * @param SearchAll $search
     */
    public function __construct(Messages\Hydrator $hydrator, SearchAll $search)
    {
        parent::__construct(new Message, $hydrator, $search);
    }

    /**
     * @return string
     */
    protected function getRequestHandler()
    {
        return Messages\Request::class;
    }

}
