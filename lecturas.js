Vue.component('v-select-clientes', VueSelect.VueSelect);
Vue.component('component-lecturas',{
    data:()=>{
        return {
            accion : 'nuevo',
        msg    : '',
        status : false,
        error  : false,
        buscar : "",
        lecturas:{
            idLectura      : 0,
            cliente : {
                id : 0,
                label : ''
            },
            codigo       : '',
            fecha        : '',
            lanterior    : '',
            lactual      : '',
            pago         : ''
 
        },
        lecturas:[],
        clientes:[]
    }
},
methods:{
    buscandoLectura(){
        this.lecturas = this.lecturas.filter((element,index,clientes) => element.nombre.toUpperCase().indexOf(this.buscar.toUpperCase())>=0 || element.codigo.toUpperCase().indexOf(this.buscar.toUpperCase())>=0 );
        if( this.buscar.length<=0){
            this.obtenerDatos();
        }
    },
    buscandoCodigoLectura(store){
        let buscarCodigo = new Promise( (resolver,rechazar)=>{
            let index = store.index("codigo"),
                data = index.get(this.lecturas.codigo);
            data.onsuccess=evt=>{
                resolver(data);
            };
            data.onerror=evt=>{
                rechazar(data);
            };
        });
        return buscarCodigo;
    },
    async guardarLectura(){
        let store = this.abrirStore("tblLecturas",'readwrite'),
            duplicado = false;
        if( this.accion=='nuevo' ){
            this.lecturas.idLectura = generarIdUnicoDesdeFecha();
            
            let data = await this.buscandoCodigoLectura(store);
            duplicado = data.result!=undefined;
        }
        if( duplicado==false){
            let query = store.put(this.lecturas);
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
            this.mostrarMsg('Codigo de lectura duplicado',true);
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
        let store = this.abrirStore('tblLecturas','readonly'),
        data = store.getAll();
    data.onsuccess=resp=>{
        this.lecturas = data.result;
    };
    let storeClientes = this.abrirStore('tblclientes', 'readonly'),
        dataClientes = storeClientes.getAll();
    this.clientes = [];
    dataClientes.onsuccess=resp=>{
        dataClientes.result.forEach(element => {
            this.clientes.push({id:element.idCliente, label:element.nombre});
        });
    };    
},
    
    mostrarLectura(lect){
        this.lecturas = lect;
        this.accion='modificar';
    },
    limpiar(){
        this.accion='nuevo';
        this.lecturas.cliente.id=0;
        this.lecturas.cliente.label="";
        this.lecturas.idLectura='';
        this.lecturas.codigo='';
        this.lecturas.fecha='';
        this.lecturas.lanterior='';
        this.lecturas.lactual='';
        this.lecturas.pago='';
       
        this.obtenerDatos();
    },
    eliminarLectura(lect){
        if( confirm(`Esta seguro que desea eliminar esta lectura:  ${lect.codigo}`) ){
            let store = this.abrirStore("tblLecturas",'readwrite'),
                req = store.delete(lect.idLectura);
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
<form v-on:submit.prevent="guardarLectura" v-on:reset="limpiar">
<div class="row">
    <div class="col-sm-5">
        <div class="row p-2">
            <div class="col-sm text-center text-white bg-primary">
                <div class="row">
                    <div class="col-11">
                        <h5>REGISTRO DE LECTURAS</h5>
                    </div>
                    <div class="col-1 align-middle" >
                        <button type="button" onclick="appVue.forms['lecturas'].mostrar=false" class="btn-close" aria-label="Close"></button>
                    </div>
                </div>
            </div>
            
             <div class="row p-2">
             <div class="col-sm">CLIENTE:</div>
             <div class="col-sm">
             <v-select-clientes v-model="lecturas.cliente" :options="clientes" placeholder="Por favor seleccione el nombre del registro"/>
              </div>
            </div>

        <div class="row p-2">
            <div class="col-sm">FECHA: </div>
            <div class="col-sm">
                <input v-model="lecturas.fecha" type="date" class="form-control form-control-sm">
        </div>

        </div>
             <div class="row p-2">
            <div class="col-sm">CODIGO:</div>
            <div class="col-sm">
                <input v-model="lecturas.codigo" required pattern="^[0-9]{4}$" type="text" class="form-control form-control-sm" >
            </div>
        </div>

  

        <div class="row p-2">
            <div class="col-sm">LECTURA ANTERIOR: </div>
            <div class="col-sm">
                <input v-model="lecturas.lanterior" type="text" class="form-control form-control-sm">
            </div>
        </div>

        <div class="row p-2">
            <div class="col-sm">LECTURA ACTUAL: </div>
            <div class="col-sm">
                <input v-model="lecturas.lactual" type="text" class="form-control form-control-sm">
            </div>
        </div>
     
        <div class="row p-2">
            <div class="col-sm">PAGO: </div>
            <div class="col-sm">
                <input v-model="lecturas.pago" type="text" class="form-control form-control-sm">
            </div>
        </div>

        </div>
        <div class="row p-2">
            <div class="col-sm text-center">
                <input type="submit" value="Guardar" class="btn btn-success">
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
        <div class="row text-center text-white bg-danger">
            <div class="col"><h5>LECTURAS REGISTRADAS</h5></div>
        </div>
        <div class="row">
            <div class="col">
                <table class="table table-sm table-hover">
                    <thead>
                        <tr>
                            <td colspan="5">
                                <input v-model="buscar" v-on:keyup="buscandoLectura" type="text" class="form-control form-contro-sm" placeholder="Buscar Lectura">
                            </td>
                        </tr>
                        <tr>
                            <th>CLIENTE</th>
                            <th>FECHA</th>
                            <th>CODIGO</th>
                            <th>LECTURA ANTERIOR</th>
                            <th>LECTURA ACTUAL</th>
                            <th>PAGO</th>

                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="lect in lecturas" v-on:click="mostrarLectura(lect)">
                            <td>{{ lect.cliente.label }}</td>
                            <td>{{ lect.fecha }}</td>
                            <td>{{ lect.codigo }}</td>
                            <td>{{ lect.lanterior }}</td>
                            <td>{{ lect.lactual }}</td>
                            <td>{{ lect.pago }}</td>
                           
                            <td>
                                <a @click.stop="eliminarLectura(lect)" class="btn btn-danger">DEL</a>
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