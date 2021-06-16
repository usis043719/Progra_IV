<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class inscripciones extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'idInscripcion', 'codigo', 'nombre', 'direccion','telefono'
    ];

}
