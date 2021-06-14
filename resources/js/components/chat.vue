<template>
    <div class="container">
        <vue-resizable :width="500" :drag-selector="toolbar">
            <form v-on:submit.prevent="guardarChat" v-on:reset="limpiar">
                <div class="card border-dark mb-3">
                    <div class="card-header bg-dark text-white toolbar">
                        <div class="row">
                            <div class="col-1">
                                <img src="/img/chat.png" alt="Chats">
                            </div>
                            <div class="col-9">
                                <h5>CHATS</h5>
                            </div>
                            <div class="col-1">
                                <button type="button" @click="cerrar" class="btn-close bg-white" aria-label="Close"></button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body text-dark">
                        <div class="row p-2">
                            <div class="col-sm">
                                <ul id="ltsMensajes">
                                   <li v-for="mimsg in chats" :key="mimsg._id">
                                       {{ mimsg.from }} :
                                       <img class="rounded img-thumbnail" width="100" height="100" v-if=" (/\.(jpg|png|gif|bmp|jfif)$/i).test(mimsg.msg)" :src="'/archivos/'+mimsg.msg" alt="Imgamen">
                                       <span v-else>{{ mimsg.msg }}</span>
                                    </li> 
                                </ul>
                            </div>
                            <div class="col-sm">
                                
                            </div>
                        </div>
                    </div>
                    <div class="card-footer bg-transparent">
                        <div class="row p-2">
                            <div class="col-10">
                                <input v-model="chat.msg" type="text" placeholder="Escribe tu mensaje aqui" class="form-control" required @keyup.enter.once="guardarChat">
                            </div>
                            <div class="col">
                                <input @change="fileChat" type="file" name="flChat" id="flChat" title="Seleccione un archivo" alt="Seleccione un archivo" >
                                <a @click="guardarChat">
                                    <img src="/img/enviar.png" width="50" height="50" alt="Enviar">
                                </a>
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
                msg    : '',
                status : false,
                error  : false,
                flName : '',
                file   : '',
                FReader : '',
                chat:{
                    id     : 0,
                    from   : document.querySelector("#navbarDropdown").innerText,
                    to     : 'many',
                    msg    : '',
                    status : 'enviado',
                    fecha  : new Date().toLocaleString('es-ES')
                },
                chats:[]
            }
        },
        methods:{
            cerrar(){
                this.form['chat'].mostrar=false;
            },
            buscandoProducto(){
                this.productos = this.productos.filter((element,index,productos) => element.descripcion.toUpperCase().indexOf(this.buscar.toUpperCase())>=0 || element.codigo.toUpperCase().indexOf(this.buscar.toUpperCase())>=0 );
                if( this.buscar.length<=0){
                    this.obtenerDatos();
                }
            },
            async guardarChat(){
                this.chat.id = generarIdUnicoDesdeFecha();
                if(this.chat.msg.trim()!=""){
                    //https://medium.com/laboratoria-developers/por-valor-vs-por-referencia-en-javascript-de3daf53a8b9
                    //this.chats.push( JSON.parse(JSON.stringify(this.chat)) );//para pasar una copia de la variable y no la referencia
                    //let data = await axios.post(`http://localhost:3001/chat`, this.chat);
                    //fetch => ajax 2.0 -> XMLHttpRequest

                    socket.emit('chat',this.chat);
                    this.chat.msg = "";
                } else{
                    this.mostrarMsg('Falta el mensaje...',true);
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
                /*const chats = await axios.get('http://localhost:3001/historial');
                this.chats = chats.data;*/
                
                socket.emit('historial');
                socket.on('historial',chats=>{
                    this.chats = chats;
                });
            },
            mostrarDatos(chat){
                this.chats.push( chat );
            },
            limpiar(){
                this.accion='nuevo';
                this.chat.id=''; 
                this.chat.from='';
                this.chat.to='';
                this.chat.msg='';
                this.chat.status='';
                this.chat.fecha='';
                this.obtenerDatos();
            },
            mostrarNotificaciones(user, msg){
                if( !windowFocus ){
                    if(Notification.permission=="granted"){
                        let options = {
                            body:msg,
                            icon: "/img/chats.png"
                        };
                        let notificacion = new Notification(user, options);
                    } else {
                        alert("NO hay permisos para enviar notificaciones...");
                    }   
                }
            },
            fileChat(file){
                this.flName = file.target.files[0].name;
                this.file = file.target.files[0];
                this.chat.msg = this.flName;
                this.FReader.onload = event=>{
                    this.chat.Data = event.target.result;
                    socket.emit('envio_archivos', this.chat);
                };
                socket.emit('inicio_envio_archivos', { 'Name' : this.flName, 'Size' : this.file.size });
            }
        },
        created(){
            this.FReader = new FileReader();
            this.obtenerDatos();

            socket.on('chat',chat=>{
                this.mostrarDatos(chat);
                this.mostrarNotificaciones(chat.from, chat.msg);
            });
            socket.on('MoreData', data=>{
                var Place = data['Place'] * 524288; //The Next Blocks Starting Position
                var NewFile; //The Variable that will hold the new Block of Data
                if(this.file.slice){ 
                    NewFile = this.file.slice(Place, Place + Math.min(524288, (this.file.size-Place)));
                }
                this.FReader.readAsBinaryString(NewFile);
            });
        },
    }
</script>
<style>
    #ltsMensajes{
        width: 450px;
        height: 350px;
        overflow-y: scroll;
    }
    
</style>
