<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Models\Session;
use App\Models\BallThrow;
use App\Models\Bounce;
use App\Models\Flight;
use App\Models\Status;
use App\Models\TypeStatus;

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

// Add a new session
// Without the total time and score
Route::put('start-game', function(Request $request) {
    $session = Session::create($request->all());
    return response()->json($session, 201);
});

// Add a new ball throw
Route::put('save-throw', function(Request $request) {
    $ballThrow = BallThrow::create($request->all());
    return response()->json($ballThrow, 201);
});

// Add a new status
Route::put('game-over', function(Request $request) {
    // Force the request to have a type_status_id equals to 2
    $request->merge(['type_status_id' => 2]);

    $status = Status::create($request->all());
    return response()->json($request, 201);
});

// Add a new flight log
Route::put('in-flight', function(Request $request) {
    $flight = Flight::create($request->all());
    return response()->json($flight, 201);
});

// Add a new bounce log
Route::put('bounce', function(Request $request) {
    $bounce = Bounce::create($request->all());
    return response()->json($bounce, 201);
});

// Add a new status
// and edit the session with total time and score
Route::post('save-distance', function(Request $request) {
    // Create a new status
    // Force the request to have a type_status_id equals to 1
    $status = Status::create([
        'type_status_id' => 1,
        'session_id' => $request->input('session_id')
    ]);


    // Get the session
    $session = Session::find($request->input('session_id'));
    // Edit the session
    $session->total_time = $request->input('total_time');
    $session->score = $request->input('score');
    $session->save();

    return response()->json($session, 200);
});

// Get the ranking of the players
Route::get('leader-board', function() {
    return Session::all()->sortByDesc('score');
});

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
