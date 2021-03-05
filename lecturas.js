Vue.component('component-lecturas',{
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
});