@extends('welcome')

@section('contenidos')

 <!-- cards -->

 <div class="row row-cols-1 row-cols-md-3 g-3">
                <div class="col">
                    <div class="card">
                    <img src="img/docent.jpg" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">DOCENTE</h5>
                            <a href="docente" class="btn btn-primary">GO DOCENTE</a>
                    </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card">
                    <img src="img/salud.png" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">MINISTERIO DE SALUD</h5>
                            <a href="salud " class="btn btn-primary">GO MINISTERIO SALUD</a>
                    </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card">
                    <img src="img/familia.jpg" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">FAMILIA</h5>
                            <a href="familia" class="btn btn-primary">GO FAMILIA</a>
                    </div>
                    </div>
                </div>
            </div>
                
                  <!-- cards -->

@endsection
