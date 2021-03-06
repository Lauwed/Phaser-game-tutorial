<?php

namespace App\Http\Controllers;

use App\Models\Bounce;
use Illuminate\Http\Request;

class BounceController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Bounce::all();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $bounce = Bounce::create($request->all());
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Bounce  $bounce
     * @return \Illuminate\Http\Response
     */
    public function show(Bounce $bounce)
    {
        return $bounce;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Bounce  $bounce
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Bounce $bounce)
    {
        return response()->json($bounce->update($request->all()), 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Bounce  $bounce
     * @return \Illuminate\Http\Response
     */
    public function destroy(Bounce $bounce)
    {
        return response()->json($bounce->delete(), 204);
    }
}
