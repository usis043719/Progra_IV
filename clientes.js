Vue.component('component-clientes',{
    data:()=>{
        return {
            accion : 'nuevo',
        msg    : '',
        status : false,
        error  : false,
        buscar : "",
        cliente:{
            idCliente      : 0,
            codigo         : '',
            nombre         : '',
            direccion      : '',
            zona           : '',
            
        },
        clientes:[]
      }
    },
    methods:{
        buscandoCliente(){
            this.clientes = this.clientes.filter((element,index,clientes) => element.nombre.toUpperCase().indexOf(this.buscar.toUpperCase())>=0 || element.codigo.toUpperCase().indexOf(this.buscar.toUpperCase())>=0 );
            if( this.buscar.length<=0){
                this.obtenerDatos();
            }
        },
        buscandoCodigoCliente(store){
            let buscarCodigo = new Promise( (resolver,rechazar)=>{
                let index = store.index("codigo"),
                    data = index.get(this.cliente.codigo);
                data.onsuccess=evt=>{
                    resolver(data);
                };
                data.onerror=evt=>{
                    rechazar(data);
                };
            });
            return buscarCodigo;
        },
        async guardarCliente(){
            /**
             * indexedDB -> BD NOSQL clave/valor
             */
            let store = this.abrirStore("tblclientes",'readwrite'),
                duplicado = false;
            if( this.accion=='nuevo' ){
                this.cliente.idCliente = generarIdUnicoDesdeFecha();
                
                let data = await this.buscandoCodigoCliente(store);
                duplicado = data.result!=undefined;
            }
            if( duplicado==false){
                let query = store.put(this.cliente);
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
                this.mostrarMsg('Codigo de cliente duplicado',true);
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
            let store = this.abrirStore('tblclientes','readonly'),
                data = store.getAll();
            data.onsuccess=resp=>{
                this.clientes = data.result;
            };
        },
        
        mostrarCliente(pro){
            this.cliente = pro;
            this.accion='modificar';
        },
        limpiar(){
            this.accion='nuevo';
            this.cliente.idCliente='';
            this.cliente.codigo='';
            this.cliente.nombre='';
            this.cliente.direccion='';
            this.cliente.zona='';
           
            this.obtenerDatos();
        },
        eliminarCliente(pro){
            if( confirm(`Esta seguro que desea eliminar este cliente:  ${pro.nombre}`) ){
                let store = this.abrirStore("tblclientes",'readwrite'),
                    req = store.delete(pro.idCliente);
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
                    <h5>REGISTRO DE CLIENTES</h5>
                </div>
            </div>
            <div class="row p-2"><!-- FUNCIONAL -->
                <div class="col-sm">CODIGO:</div>
                <div class="col-sm">
                    <input v-model="cliente.codigo" required pattern="^[0-9]{4}$" type="text" class="form-control form-control-sm" placeholder="XXXX"" >
                </div>
            </div>
            <div class="row p-2"><!-- FUNCIONAL -->
                <div class="col-sm">NOMBRE: </div>
                <div class="col-sm">
                    <input v-model="cliente.nombre" required pattern="[A-ZÑña-z0-9 ]{5,65}" type="text" class="form-control form-control-sm" placeholder="XXXX XXXX XXXX XXXX">
                </div>
            </div>
            <div class="row p-2"><!-- FUNCIONAL -->
                <div class="col-sm">DIRECCION: </div>
                <div class="col-sm">
                    <input v-model="cliente.direccion" required pattern="[A-ZÑña-z0-9 ]{5,65}" type="text" class="form-control form-control-sm" placeholder="XXXXXX">
                </div>
            </div>
            
            <div class="row p-2"><!-- FUNCIONAL -->
                <div class="col-sm">ZONA: </div>
                <div class="col-sm">
                    <input v-model="cliente.zona" required pattern="[A-ZÑña-z0-9 ]{5,15}" type="text" class="form-control form-control-sm" placeholder="XXXXX">
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
                <div class="col"><h5>CLIENTES REGISTRADOS</h5></div>
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
                                <th>CODIGO</th>
                                <th>NOMBRE</th>
                                <th>DIRECCION</th>
                                <th>ZONA</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="pro in clientes" v-on:click="mostrarCliente(pro)">
                                <td>{{ pro.codigo }}</td>
                                <td>{{ pro.nombre }}</td>
                                <td>{{ pro.direccion }}</td>
                                <td>{{ pro.zona }}</td>
                               
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