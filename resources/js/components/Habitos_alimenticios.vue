<template>
    <form v-on:submit.prevent="guardarCalcular_peso" v-on:reset="limpiar">
    <div class="row">
        <div class="col-sm-5">
            <div class="row p-2">
                <div class="col-sm text-center text-white btn-success">
                    <h5>CALCULAR PESO/h5>
                </div>
            </div>
            <div class="row p-2"><!-- FUNCIONAL -->
                <div class="col-sm">CODIGO:</div>
                <div class="col-sm">
                    <input v-model="calcular_peso.codigo" required pattern="^[0-9]{4}$" type="text" class="form-control form-control-sm" placeholder="XXXX" >
                </div>
            </div>
            <div class="row p-2"><!-- FUNCIONAL -->
                <div class="col-sm">NOMBRE: </div>
                <div class="col-sm">
                    <input v-model="calcular_peso.nombre" required pattern="[A-ZÑña-z0-9 ]{5,65}" type="text" class="form-control form-control-sm" placeholder="NOMBRE DEL ESTUDIANTE">
                </div>
            </div>
            <div class="row p-2"><!-- FUNCIONAL -->
                <div class="col-sm">PESO: </div>
                <div class="col-sm">
                    <input v-model="calcular_peso.peso" required pattern="[A-ZÑña-z0-9 ]{5,65}" type="text" class="form-control form-control-sm" placeholder="INGRESAR PESO EN KILOGRAMO">
                </div>
            </div>
            
            <div class="row p-2"><!-- FUNCIONAL -->
                <div class="col-sm">ALTURA: </div>
                <div class="col-sm">
                    <input v-model="calcular_peso.altura" required pattern="[A-ZÑña-z0-9 ]{5,15}" type="text" class="form-control form-control-sm" placeholder="INGRESAR ALTURA EN METROS">
                </div>
            </div>            
            <div class="row p-2"><!-- FUNCIONAL -->
                <div class="col-sm">IMAGEN:</div>
                <div class="col-sm">
                    <img width="200" height="200" class="rounded-circle" :src="calcular_peso.img">
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
            <div class="row text-center text-white bg-primary">
                <div class="col"><h5>DATOS INGRESADOS</h5></div>
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
                                <th>PESO</th>   
                                <th>ALTURA</th>
                                <th>IMG</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="pro in calcular_peso" v-bind:key="pro.idcalcular_peso" v-on:click="mostrarcalcular_peso(pro)">
                                <td>{{ pro.codigo }}</td>
                                <td>{{ pro.nombre }}</td>
                                <td>{{ pro.peso }}</td>                                
                                <td>{{ pro.altura }}</td>
                                <td>{{ pro.img }}</td>
                                <td>
                                    <a @click.stop="eliminarcalcular_peso(pro)" class="btn btn-danger">DEL</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</form>
</template>




<script>
var generarIdUnicoDesdeFecha=()=>{
    let fecha = new Date();//03/02/2021
    return Math.floor(fecha.getTime()/1000).toString(16);
}
export default{
    data:()=>{
                return {
            accion : 'nuevo',
        msg    : '',
        status : false,
        error  : false,
        buscar : "",
        calcular_pesos:{
            idcalcular_peso       : 0,
            codigo         : '',
            nombre         : '',
            peso      : '',   
            altura  : '',
            img         : '/images/No-image-available.png',
            img2        : '/images/No-image-available.png'
        },
        calcular_peso:[]
      }
    },
    methods:{
        buscandocalcular_peso(){
            this.calcular_peso = this.calcular_peso.filter((element,index,calcular_peso) => element.nombre.toUpperCase().indexOf(this.buscar.toUpperCase())>=0 || element.codigo.toUpperCase().indexOf(this.buscar.toUpperCase())>=0 );
            if( this.buscar.length<=0){
                this.obtenerDatos();
            }
        },
        buscandoCodigocalcular_peso(store){
            let buscarCodigo = new Promise( (resolver,rechazar)=>{
                let index = store.index("codigo"),
                    data = index.get(this.calcular_peso.codigo);
                data.onsuccess=evt=>{
                    resolver(data);
                };
                data.onerror=evt=>{
                    rechazar(data);
                };
            });
            return buscarCodigo;
        },
        async guardarcalcular_peso(){
            /**
             * indexedDB -> BD NOSQL clave/valor
             */
            let store = this.abrirStore("tblcalcular_pesos",'readwrite'),
                duplicado = false;
            if( this.accion=='nuevo' ){
                this.alumno.idcalcular_peso = generarIdUnicoDesdeFecha();
                
                let data = await this.buscandoCodigocalcular_peso(store);
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
            let store = this.abrirStore('tblcalcular_pesos','readonly'),
                data = store.getAll();
            data.onsuccess=resp=>{
                this.calcular_peso = data.result;
            };
        },
        obtenerImg(e){
            //IMG 1
            let rutaTemp = URL.createObjectURL(e.target.files[0]);
            this.calcular_pesos.img = rutaTemp;
            //IMG2
            /*rutaTemp = URL.createObjectURL(e.target.files[1]);
            this.producto.img2 = rutaTemp;*/
        },
        mostrarcalcular_peso(pro){
            this.alumno = pro;
            this.accion='modificar';
        },
        limpiar(){
            this.accion='nuevo';
            this.calcular_peso.idcalcular_peso='';
            this.calcular_peso.codigo='';
            this.calcular_peso.nombre='';
            this.calcular_peso.peso='';           
            this.calcular_peso.altura='';   
            this.calcular_peso.img='';
            this.obtenerDatos();
        },
        eliminarcalcular_peso(pro){
            if( confirm(`Esta seguro que desea eliminar el alumno:  ${pro.nombre}`) ){
                let store = this.abrirStore("tblcalcular_pesos",'readwrite'),
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
    }
</script>