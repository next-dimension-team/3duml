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

Route::group(['namespace' => 'Api'], function () {
    Route::resource('lifelines', 'LifelineController', [
        'except' => ['create', 'edit'],
    ]);

    Route::resource('messages', 'MessageController', [
        'except' => ['create', 'edit'],
    ]);

    Route::resource('occurrence-specifications', 'OccurrenceSpecificationController', [
        'except' => ['create', 'edit'],
    ]);

    Route::resource('interactions', 'InteractionController', [
        'except' => ['create', 'edit'],
    ]);

    Route::resource('interaction-fragments', 'InteractionFragmentController', [
        'except' => ['create', 'edit'],
    ]);

    Route::resource('interaction-operands', 'InteractionOperandController', [
        'except' => ['create', 'edit'],
    ]);

    Route::resource('combined-fragments', 'CombinedFragmentController', [
        'except' => ['create', 'edit'],
    ]);

    Route::resource('execution-specifications', 'ExecutionSpecificationController', [
        'except' => ['create', 'edit'],
    ]);

    Route::resource('layers', 'LayerController', [
        'except' => ['create', 'edit'],
    ]);
});
