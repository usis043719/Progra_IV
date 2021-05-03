<?php

namespace App\Http\Controllers;

use App\Models\inscripciones;
use Illuminate\Http\Request;

class InscripcionesController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return inscripciones::get();//select * from inscripciones
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $id = inscripciones::create($request->all())->id;
        return response()->json($id, 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\inscripciones  $cliente
     * @return \Illuminate\Http\Response
     */
    public function show(inscripciones $cliente)
    {
        return $cliente;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\inscripciones  $cliente
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, inscripciones $cliente)
    {
        $cliente->update($request->all());
        return response()->json($request->id,200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\inscripciones  $cliente
     * @return \Illuminate\Http\Response
     */
    public function destroy(inscripciones $cliente)
    {
        $cliente->delete();
        return response()->json($cliente->id,200);
    }
}
