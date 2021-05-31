<template>
    <div class="container">
        <vue-resizable :width="500" :drag-selector="toolbar">
            <form v-on:submit.prevent="guardarChat" v-on:reset="limpiar">
                <div class="card border-dark mb-3">
                    <div class="card-header bg-dark text-white toolbar">
                        <div class="row">
                            <div class="col-1">
                                <img src="../../../public/img/chats.png" alt="Chats">
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
                                <ul>
                                   <li v-for="mimsg in chats" :key="mimsg._id">{{ mimsg.from }} : {{ mimsg.msg }}</li> 
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
                                <a @click="guardarChat">
                                    <img src="../../../public/img/enviar.png" width="50" height="50" alt="Enviar">
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
        },
        created(){
            this.obtenerDatos();

            socket.on('chat',chat=>{
                this.mostrarDatos(chat);
            });
        },
    }
</script>
