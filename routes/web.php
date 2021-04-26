<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::view('/docente', 'docente')->name('docente');

Route::view('/salud', 'salud')->name('salud');

Route::view('/familia', 'familia')->name('familia');

Auth::routes();

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('docente');

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index2'])->name('salud');

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index3'])->name('familia');
