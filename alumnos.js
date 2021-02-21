Vue.component('componentalumnos',{
    data:()=>{
        return {
            accion : 'nuevo',
        msg    : '',
        status : false,
        error  : false,
        buscar : "",
        alumno:{
            idAlumno       : 0,
            codigo         : '',
            nombre         : '',
            direccion      : '',
           
            departamento   : '',
            telefono       : '',
            fecha_de_nacimiento: '',
            
            img         : '/images/No-image-available.png',
            img2        : '/images/No-image-available.png'
        },
        alumnos:[]
      }
    },
    methods:{
        buscandoAlumno(){
            this.alumnos = this.alumnos.filter((element,index,alumnos) => element.nombre.toUpperCase().indexOf(this.buscar.toUpperCase())>=0 || element.codigo.toUpperCase().indexOf(this.buscar.toUpperCase())>=0 );
            if( this.buscar.length<=0){
                this.obtenerDatos();
            }
        },
        buscandoCodigoAlumno(store){
            let buscarCodigo = new Promise( (resolver,rechazar)=>{
                let index = store.index("codigo"),
                    data = index.get(this.alumno.codigo);
                data.onsuccess=evt=>{
                    resolver(data);
                };
                data.onerror=evt=>{
                    rechazar(data);
                };
            });
            return buscarCodigo;
        },
        async guardarAlumno(){
            /**
             * indexedDB -> BD NOSQL clave/valor
             */
            let store = this.abrirStore("tblalumnos",'readwrite'),
                duplicado = false;
            if( this.accion=='nuevo' ){
                this.alumno.idAlumno = generarIdUnicoDesdeFecha();
                
                let data = await this.buscandoCodigoAlumno(store);
                duplicado = data.result!=undefined;
            }
            if( duplicado==false){
                let query = store.put(this.alumno);
                query.onsuccess=event=>{
                    this.obtenerDatos();
                    this.limpiar();
                    
                    this.mostrarMsg('Registro guardado con exito',false);
                };
                query.onerror=event=>{
                    this.mostrarMsg('Error al guardar registro',true);
                    console.log( event );
                };
            } else{
                this.mostrarMsg('Codigo de alumno duplicado',true);
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
            let store = this.abrirStore('tblalumnos','readonly'),
                data = store.getAll();
            data.onsuccess=resp=>{
                this.alumnos = data.result;
            };
        },
        mostrarAlumno(pro){
            this.alumno = pro;
            this.accion='modificar';
        },
        limpiar(){
            this.accion='nuevo';
            this.alumno.idAlumno='';
            this.alumno.codigo='';
            this.alumno.nombre='';
            this.alumno.direccion='';
            
            this.alumno.departamento='';
            this.alumno.telefono='';
            this.alumno.fecha_de_nacimiento='';
            
            this.alumno.img='';
            this.obtenerDatos();
        },
        eliminarAlumno(pro){
            if( confirm(`Esta seguro que desea eliminar el alumno:  ${pro.nombre}`) ){
                let store = this.abrirStore("tblalumnos",'readwrite'),
                    req = store.delete(pro.idAlumno);
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
    template:`
    <form v-on:submit.prevent="guardarAlumno" v-on:reset="limpiar">
    <div class="row">
        <div class="col-sm-5">
            <div class="row p-2">
                <div class="col-sm text-center text-white btn-success">
                    <h5>REGISTRO DE ALUMNOS</h5>
                </div>
            </div>
            <div class="row p-2"><!-- FUNCIONAL -->
                <div class="col-sm">CODIGO:</div>
                <div class="col-sm">
                    <input v-model="alumno.codigo" required pattern="^[0-9]{4}$" type="text" class="form-control form-control-sm" placeholder="XXXX"" >
                </div>
            </div>
            <div class="row p-2"><!-- FUNCIONAL -->
                <div class="col-sm">NOMBRE: </div>
                <div class="col-sm">
                    <input v-model="alumno.nombre" required pattern="[A-ZÑña-z0-9 ]{5,65}" type="text" class="form-control form-control-sm" placeholder="XXXX XXXX XXXX XXXX">
                </div>
            </div>
            <div class="row p-2"><!-- FUNCIONAL -->
                <div class="col-sm">DIRECCION: </div>
                <div class="col-sm">
                    <input v-model="alumno.direccion" required pattern="[A-ZÑña-z0-9 ]{5,65}" type="text" class="form-control form-control-sm" placeholder="XXXXXX">
                </div>
            </div>
            
            <div class="row p-2"><!-- FUNCIONAL -->
                <div class="col-sm">DEPARTAMENTO: </div>
                <div class="col-sm">
                    <input v-model="alumno.departamento" required pattern="[A-ZÑña-z0-9 ]{5,15}" type="text" class="form-control form-control-sm" placeholder="XXXXX">
                </div>
            </div>
            <div class="row p-2"><!-- FUNCIONAL -->
                <div class="col-sm">TELEFONO:</div>
                <div class="col-sm">
                    <input v-model="alumno.telefono" required pattern="[0-9]{4}-[0-9]{4}" type="text" class="form-control form-control-sm" placeholder="Ejem: 0000-0000">
                </div>
            </div>
            <div class="row p-2">
                <div class="col-sm">FECHA_DE_NACIMIENTO: </div>
                <div class="col-sm">
                    <input v-model="alumno.fecha_de_nacimiento" required pattern="{0000-00-00}" type="date" class="form-control form-control-sm" placeholder="Ejem: 0000-00-00">
                </div>
            </div>
            
            <div class="row p-2"><!-- FUNCIONAL -->
                <div class="col-sm">IMAGEN:</div>
                <div class="col-sm">
                    <img width="200" height="200" class="rounded-circle" :src="alumno.img">
                    <!--<img class="img-fluid" :src="alumno.img2">-->
                    <input v-on:change="obtenerImg($event)" multiple type="file" class="form-control form-control-sm">
                </div>
            </div>
            <div class="row p-2">
                <div class="col-sm text-center">
                    <input type="submit" value="Guardar" class="btn btn-dark">
                    <input type="reset" value="Limpiar" class="btn btn-warning">
                </div>
            </div>
            <div class="row p-2">
                <div class="col-sm text-center">
                    <div v-if="status" class="alert" v-bind:class="[error ? 'alert-danger' : 'alert-success']">
                        {{ msg }}
                    </div>
                </div>
            </div>
        </div>
        
        
        <div class="col-sm"></div>
        <div class="col-sm-6 p-2">
            <div class="row text-center text-white btn-success">
                <div class="col"><h5>ALUMNOS REGISTRADOS</h5></div>
            </div>
            
            <div class="row">
                <div class="col">
                    <table class="table table-sm table-hover">
                        <thead>
                            <tr>
                                <td colspan="5">
                                    <input v-model="buscar" v-on:keyup="buscandoAlumno" type="text" class="form-control form-contro-sm" placeholder="Buscar alumnos">
                                </td>
                            </tr>
                            <tr>
                                <th>CODIGO</th>
                                <th>NOMBRE</th>
                                <th>DIRECCION</th>
                                
                                <th>DEPARTAMENTO</th>
                                <th>TELEFONO</th>
                                <th>FECHA_DE_NACIMIENTO</th>
                                
                                <th>IMG</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="pro in alumnos" v-on:click="mostrarAlumno(pro)">
                                <td>{{ pro.codigo }}</td>
                                <td>{{ pro.nombre }}</td>
                                <td>{{ pro.direccion }}</td>
                                
                                <td>{{ pro.departamento }}</td>
                                <td>{{ pro.telefono }}</td>
                                <td>{{ pro.fecha_de_nacimiento }}</td>
                                
                                <td>{{ pro.img }}</td>
                                <td>
                                    <a @click.stop="eliminarAlumno(pro)" class="btn btn-danger">DEL</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</form>
    `
});