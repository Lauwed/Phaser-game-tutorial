<?php

namespace App\Http\Controllers;

use App\Models\BallThrow;
use Illuminate\Http\Request;

class BallThrowController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return BallThrow::all();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $ballThrow = BallThrow::create($request->all());

        return response()->json($ballThrow, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\BallThrow  $ballThrow
     * @return \Illuminate\Http\Response
     */
    public function show(BallThrow $ballThrow)
    {
        return $ballThrow;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\BallThrow  $ballThrow
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, BallThrow $ballThrow)
    {
        return response()->json($ballThrow->update($ballThrow->all()), 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\BallThrow  $ballThrow
     * @return \Illuminate\Http\Response
     */
    public function destroy(BallThrow $ballThrow)
    {
        return response()->json($ballThrow->delete(), 204);
    }
}
