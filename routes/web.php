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



Route::view('/', 'categorias')->name('categorias');


Route::view('/docente', 'docente')->name('docente');

Route::view('/salud', 'salud')->name('salud');

Route::view('/familia', 'familia')->name('familia');

Route::view('/chat', 'chat')->name('chat');


Auth::routes();

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('categorias');


