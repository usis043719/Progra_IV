<?php

namespace App\Http\Controllers;

use App\inscripciones;
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
        $id = Inscripciones::create($request->all())->id;
        return response()->json($id, 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\inscripciones  $inscripcion
     * @return \Illuminate\Http\Response
     */
    public function show(inscripciones $inscripcion)
    {
        return $inscripcion;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\inscripciones  $inscripcion
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, inscripciones $inscripcion)
    {
        $inscripcion->update($request->all());
        return response()->json($request->id,200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\inscripciones  $inscripcion
     * @return \Illuminate\Http\Response
     */
    public function destroy(inscripciones $inscripcion)
    {
        $inscripcion->delete();
        return response()->json($inscripcion->id,200);
    }
}
