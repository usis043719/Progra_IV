Vue.component('componentmatriculas',{
    data:()=>{
        return {
            accion : 'nuevo',
            msg    : '',
            status : false,
            error  : false,
            buscar : "",
            cliente:{
              
            },
            matriculas:[]
        }
    }
});