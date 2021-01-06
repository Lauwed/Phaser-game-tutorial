<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\SessionController;
use App\Http\Controllers\BallThrowController;
use App\Http\Controllers\BounceController;
use App\Http\Controllers\FlightController;
use App\Http\Controllers\StatusController;
use App\Http\Controllers\TypeStatusController;

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

Route::apiResource('sessions', SessionController::class);
Route::apiResource('ballThrows', BallThrowController::class);
Route::apiResource('bouces', BounceController::class);
Route::apiResource('flights', FlightController::class);
Route::apiResource('statuses', StatusController::class);
Route::apiResource('typeStatuses', TypeStatusController::class);

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
