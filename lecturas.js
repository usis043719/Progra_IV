Vue.component('v-select-clientes', VueSelect.VueSelect);
Vue.component('component-lecturas',{
    data:()=>{
        return {
            accion : 'nuevo',
        msg    : '',
        status : false,
        error  : false,
        buscar : "",
        lectura:{
            nombre         : '',
            clientes : {
                id : 0,
                label : ''
            },
            idLectura      : 0,
            codigo         : '',
 
        },
        lecturas:[],
        clientes:[]
    }
},
methods:{
    buscandoCliente(){
        this.lecturas = this.lecturas.filter((element,index,clientes) => element.nombre.toUpperCase().indexOf(this.buscar.toUpperCase())>=0 || element.codigo.toUpperCase().indexOf(this.buscar.toUpperCase())>=0 );
        if( this.buscar.length<=0){
            this.obtenerDatos();
        }
    },
    buscandoCodigoCliente(store){
        let buscarCodigo = new Promise( (resolver,rechazar)=>{
            let index = store.index("codigo"),
                data = index.get(this.lectura.codigo);
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
            this.lectura.idLectura = generarIdUnicoDesdeFecha();
            
            let data = await this.buscandoCodigoCliente(store);
            duplicado = data.result!=undefined;
        }
        if( duplicado==false){
            let query = store.put(this.lectura);
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
        this.lectura = data.result;
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
    
    mostrarCliente(pro){
        this.lectura = pro;
        this.accion='modificar';
    },
    limpiar(){
        this.accion='nuevo';
        this.lectura.idLectura='';
        this.lectura.codigo='';
        this.lectura.nombre='';
       
        this.obtenerDatos();
    },
    eliminarCliente(pro){
        if( confirm(`Esta seguro que desea eliminar este cliente:  ${pro.nombre}`) ){
            let store = this.abrirStore("tblLecturas",'readwrite'),
                req = store.delete(pro.idLectura);
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
<form v-on:submit.prevent="guardarCliente" v-on:reset="limpiar">
<div class="row">
    <div class="col-sm-5">
        <div class="row p-2">
            <div class="col-sm text-center text-white btn-success">
                <h5>REGISTRO DE LECTURAS</h5>
            </div>
            <div class="col-1 align-middle" >
                                <button type="button" onclick="appVue.forms['clientes'].mostrar=false" class="btn-close" aria-label="Close"></button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row p-2">
                        <div class="col-sm">NOMBRE:</div>
                        <div class="col-sm">
                            <v-select-clientes v-model="lecturas.clientes" :options="clientes" placeholder="Por favor seleccione el nombre del registro"/>
                        </div>
                        </div>
                        <div class="row p-2"><!-- FUNCIONAL -->
                            <div class="col-sm">IDCODIGO: </div>
                            <div class="col-sm">
                                <input v-model="lectura.idcodigo" required pattern="[A-ZÑña-z0-9 ]{5,65}" type="text" class="form-control form-control-sm" placeholder="Escriba su nombre">
                            </div>
        </div>
        <div class="row p-2"><!-- FUNCIONAL -->
            <div class="col-sm">CODIGO:</div>
            <div class="col-sm">
                <input v-model="lectura.codigo" required pattern="^[0-9]{4}$" type="text" class="form-control form-control-sm" placeholder="000X"" >
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
            <div class="col"><h5> LECTURAS </h5></div>
        </div>
        
        <div class="row">
            <div class="col">
                <table class="table table-sm table-hover">
                    <thead>
                        <tr>
                            <td colspan="5">
                                <input v-model="buscar" v-on:keyup="buscandoCliente" type="text" class="form-control form-contro-sm" placeholder="Buscar Cliente">
                            </td>
                        </tr>
                        <tr>
                            <th>NOMBRE</th>
                            <th>IDCODIGO</th>
                            <th>CODIGO</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="pro in lecturas" v-on:click="mostrarCliente(pro)">
                            <td>{{ pro.nombre }}</td>
                            <td>{{ pro.idcodigo }}</td>
                            <td>{{ pro.codigo }}</td>
                           
                            <td>
                                <a @click.stop="eliminarCliente(pro)" class="btn btn-danger">DEL</a>
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