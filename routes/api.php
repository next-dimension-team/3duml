<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

/*
Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
*/

Route::prefix('v1')
     ->middleware('json-api:v1')
     ->namespace('Api')
     ->as('api-v1::')
     ->group(function() {
         JsonApi::resource('lifelines');
         JsonApi::resource('messages');
         JsonApi::resource('occurrence-specifications');
         JsonApi::resource('interactions');
         JsonApi::resource('interaction-fragments');
         JsonApi::resource('interaction-operands');
         JsonApi::resource('combined-fragments');
         JsonApi::resource('execution-specifications');
     });
