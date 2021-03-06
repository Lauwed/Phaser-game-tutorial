<?php

namespace App\Http\Controllers;

use App\Models\TypeStatus;
use Illuminate\Http\Request;

class TypeStatusController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return TypeStatus::all();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $typeStatus = TypeStatus::create($request->all());

        return response()->json($typeStatus, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\TypeStatus  $typeStatus
     * @return \Illuminate\Http\Response
     */
    public function show(TypeStatus $typeStatus)
    {
        return $typeStatus;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\TypeStatus  $typeStatus
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, TypeStatus $typeStatus)
    {
        return response()->json($typeStatus->updqte($request->all()), 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\TypeStatus  $typeStatus
     * @return \Illuminate\Http\Response
     */
    public function destroy(TypeStatus $typeStatus)
    {
        return response()->json($typeStatus->delete(), 204);
    }
}
