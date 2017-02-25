<?php

namespace App\JsonApi\InteractionFragments;

use CloudCreativity\JsonApi\Http\Requests\RequestHandler;

class Request extends RequestHandler
{
    /**
     * A list of has-one relationships that are expected as endpoints.
     *
     * @var array
     */
    protected $hasOne = [
        'fragmentable',
        'parent',
    ];

    /**
     * A list of has-many relationships that are exposed as endpoints.
     *
     * @var array
     */
    protected $hasMany = [
        'children'
    ];

    /**
     * @var string[]|null
     */
    protected $allowedIncludePaths = null;

    /**
     * @var array
     */
    protected $allowedSortParameters = [
        'created_at',
        'updated_at',
    ];

    /**
     * @var array
     */
    protected $allowedFilteringParameters = [
        'id',
        'roots',
    ];

    /**
     * Request constructor.
     * @param Validators $validator
     */
    public function __construct(Validators $validator)
    {
        parent::__construct(null, $validator);
    }

    /**
     * @return string
     */
    public function getResourceType()
    {
        return Schema::RESOURCE_TYPE;
    }
}
