<?php

namespace App\Http\Controllers\Api;

use NilPortugues\Laravel5\JsonApi\Controller\JsonApiController;

abstract class ApiController extends JsonApiController
{
    protected $pageSize = PHP_INT_MAX;
}
