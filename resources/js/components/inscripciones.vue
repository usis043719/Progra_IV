<template>
    <div class="container">
        <vue-resizable :width="500" :drag-selector="toolbar">
            <form v-on:submit.prevent="guardarInscripcion" v-on:reset="limpiar">
                <div class="card border-dark mb-3">
                    <div class="card-header bg-dark text-white toolbar">
                        <div class="row">
                            <div class="col-1">
                                <img src="/img/inscripcion.png" alt="Inscripciones">
                            </div>
                            <div class="col-10">
                                <h5>REGISTRO DE INSCRIPCIONES</h5>
                            </div>
                            <div class="col-1">
                                <button type="button" @click="cerrar" class="btn-close bg-white" aria-label="Close"></button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body text-dark">
                        <div class="row p-2">
                            <div class="col-sm">CODIGO:</div>
                            <div class="col-sm">
                                <input v-model="inscripcion.codigo" required type="text" class="form-control form-control-sm" >
                            </div>
                        </div>
                        <div class="row p-2">
                            <div class="col-sm">NOMBRE: </div>
                            <div class="col-sm">
                                <input v-model="inscripcion.nombre" required pattern="[A-ZÑña-z0-9, ]{5,65}" type="text" class="form-control form-control-sm">
                            </div>
                        </div>
                        <div class="row p-2">
                            <div class="col-sm">DIRECCION: </div>
                            <div class="col-sm">
                                <input v-model="inscripcion.direccion" required pattern="[A-ZÑña-z0-9, ]{5,65}" type="text" class="form-control form-control-sm">
                            </div>
                        </div>
                        <div class="row p-2">
                            <div class="col-sm">TEL: </div>
                            <div class="col-sm">
                                <input v-model="inscripcion.telefono" required pattern="[0-9]{4}-[0-9]{4}" type="text" class="form-control form-control-sm">
                            </div>
                        </div>
                    </div>
                    <div class="card-footer bg-transparent">
                        <div class="row p-2">
                            <div class="col-sm text-center">
                                <input type="submit" value="Guardar" class="btn btn-dark">
                                <input type="reset" value="Limpiar" class="btn btn-warning">
                            </div>
                        </div>
                        <div class="row p-2">
                            <div class="col-sm text-center">
                                <mensajes-component :msg="msg" :error="error" v-show="status" ></mensajes-component>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </vue-resizable>
        <vue-resizable :width="600" :drag-selector="toolbar">
            <div class="card border-dark mb-3">
                <div class="card-header bg-dark text-white toolbar">
                    <div class="row">
                        <div class="col-1">
                            <img src="/img/buscar.png" alt="Inscripciones">
                        </div>
                        <div class="col-10">
                            <h5>INSCRIPCIONES REGISTRADOS</h5>
                        </div>
                        <div class="col-1">
                            <button type="button" @click="cerrar" class="btn-close bg-white" aria-label="Close"></button>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <table class="table table-sm table-hover">
                        <thead>
                            <tr>
                                <td colspan="5">
                                    <input v-model="buscar" v-on:keyup="buscandoInscripcion" type="text" class="form-control form-contro-sm" placeholder="Buscar inscripciones">
                                </td>
                            </tr>
                            <tr>
                                <th>CODIGO</th>
                                <th>NOMBRE</th>
                                <th>DIRECCION</th>
                                <th>TEL</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="pro in inscripciones" v-bind:key="pro.idInscripcion" v-on:click="mostrarInscripcion(pro)">
                                <td>{{ pro.codigo }}</td>
                                <td>{{ pro.nombre }}</td>
                                <td>{{ pro.direccion }}</td>
                                <td>{{ pro.telefono }}</td>
                                <td>
                                    <a @click.stop="eliminarInscripcion(pro)" class="btn btn-danger">DEL</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </vue-resizable>
    </div>
</template>

<script> 
    //https://github.com/nikitasnv/vue-resizable
    Vue.component('vue-resizable',VueResizable.default);
    export default {
        props:['form'],
        data(){
            return {
                toolbar: '.toolbar',
                accion : 'nuevo',
                msg    : '',
                status : false,
                error  : false,
                buscar : "",
                inscripcion:{
                    id        : 0,
                    idInscripcion : 0,
                    codigo    : '',
                    nombre    : '',
                    direccion : '',
                    telefono  : '',
                },
                inscripciones:[]
            }
        },
        methods:{
            buscandoInscripcion(){
                this.inscripciones = this.inscripciones.filter((element,index,inscripciones) => element.nombre.toUpperCase().indexOf(this.buscar.toUpperCase())>=0 || element.codigo.toUpperCase().indexOf(this.buscar.toUpperCase())>=0 );
                if( this.buscar.length<=0){
                    this.obtenerDatos();
                }
            },
            cerrar(){
                this.form['inscripcion'].mostrar=false;
            },
            buscandoCodigoInscripcion(store){
                let buscarCodigo = new Promise( (resolver,rechazar)=>{
                    let index = store.index("codigo"),
                        data = index.get(this.inscripcion.codigo);
                    data.onsuccess=evt=>{
                        resolver(data);
                    };
                    data.onerror=evt=>{
                        rechazar(data);
                    };
                });
                return buscarCodigo;
            },
            async guardarInscripcion(){
                /**
                 * webSQL -> DB Relacional en el navegador
                 * localStorage -> BD NOSQL clave/valor
                 * indexedDB -> BD NOSQL clave/valor
                 */
                let store = this.abrirStore("tblinscripciones",'readwrite'),
                    duplicado = false;
                if( this.accion=='nuevo' ){
                    this.inscripcion.idInscripcion = generarIdUnicoDesdeFecha();
                    
                    let data = await this.buscandoCodigoInscripcion(store);
                    duplicado = data.result!=undefined;
                }
                if( duplicado==false){
                    if( this.accion=='nuevo' ){
                        const resp = await axios.post('inscripciones',this.inscripcion);
                        this.inscripcion.id = resp.data;
                    } else {
                        const resp = await axios.put(`inscripciones/${this.inscripcion.id}`,this.inscripcion);
                    }
                    let tabla = this.abrirStore("tblinscripciones",'readwrite'),
                        query = tabla.put(this.inscripcion);
                    query.onsuccess=event=>{
                        this.obtenerDatos();
                        this.limpiar();
                        
                        this.mostrarMsg('Registro se guardo con exito',false);
                    };
                    query.onerror=event=>{
                        this.mostrarMsg('Error al guardar el registro',true);
                        console.log( event );
                    };
                } else{
                    this.mostrarMsg('Codigo de inscripcion duplicado',true);
                }
            },
            mostrarMsg(msg, error){
                this.status = true;
                this.msg = msg;
                this.error = error;
                this.quitarMsg(3);
            },
            quitarMsg(time){
                setTimeout(()=>{
                    this.status=false;
                    this.msg = '';
                    this.error = false;
                }, time*1000);
            },
            obtenerDatos(){
                let store = this.abrirStore('tblinscripciones','readonly'),
                    data = store.getAll();
                data.onsuccess=async resp=>{
                    if( data.result.length===0 ){
                        const inscripciones = await axios.get('inscripciones');
                        this.inscripciones = inscripciones.data;

                        let tabla = this.abrirStore('tblinscripciones','readwrite');
                        this.inscripciones.forEach(element => {
                            let inscripcion = {
                                id        : element.id,
                                idInscripcion : element.idInscripcion,
                                codigo    : element.codigo,
                                nombre    : element.nombre,
                                direccion : element.direccion,
                                telefono  : element.telefono,
                            };
                            tabla.put(inscripcion);
                        });
                    } else {
                        this.inscripciones = data.result;
                    }
                };
            },
            mostrarInscripcion(pro){
                this.inscripcion = pro;
                this.accion='modificar';
            },
            limpiar(){
                this.accion='nuevo';
                this.inscripcion.idInscripcion='';
                this.inscripcion.codigo='';
                this.inscripcion.nombre='';
                this.inscripcion.direccion='';
                this.inscripcion.telefono='';
                this.obtenerDatos();
            },
            async eliminarInscripcion(pro){
                if( confirm(`Esta seguro que desea eliminar el inscripcion:  ${pro.nombre}`) ){
                    const data = await axios.delete(`inscripciones/${pro.id}`);
                    
                    let store = this.abrirStore("tblinscripciones",'readwrite'),
                        req = store.delete(pro.idInscripcion);
                    req.onsuccess=resp=>{
                        this.mostrarMsg('Registro eliminado con exito',true);
                        this.obtenerDatos();
                    };
                    req.onerror=resp=>{
                        this.mostrarMsg('Error al eliminar el registro',true);
                        console.log( resp );
                    };
                }
            },
            abrirStore(store,modo){
                let tx = db.transaction(store,modo);
                return tx.objectStore(store);
            }
        },
        created(){
            //this.obtenerDatos();
        },
    }
</script>
