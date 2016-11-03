<?php 

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/

Route::get('/', function()
{
	return View::make('hello');
});


Route::resource('stateinvariant', 'StateInvariantController');
Route::resource('combinedfragment', 'CombinedFragmentController');
Route::resource('interaction', 'InteractionController');
Route::resource('interactionoperand', 'InteractionOperandController');
Route::resource('lifeline', 'LifelineController');
Route::resource('executionoccurrencespecification', 'ExecutionOccurrenceSpecificationController');
Route::resource('generalordering', 'GeneralOrderingController');
Route::resource('message', 'MessageController');
Route::resource('messageend', 'MessageEndController');
Route::resource('messageoccurrencespecifications', 'MessageOccurrenceSpecificationsController');
Route::resource('lifelinecombinedfragments', 'LifelineCombinedFragmentsController');
Route::resource('lifelineinteractionoperand', 'LifelineInteractionOperandController');
