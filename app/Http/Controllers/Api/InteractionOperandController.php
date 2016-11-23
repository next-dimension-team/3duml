<?php

namespace App\Http\Controllers\Api;

use App\Models\InteractionOperand;

class InteractionOperandController extends ApiController
{
    /**
     * Return the Eloquent model that will be used
     * to model the JSON API resources.
     *
     * @return \Illuminate\Database\Eloquent\Model
     */
    public function getDataModel()
    {
        return new InteractionOperand;
    }
}
