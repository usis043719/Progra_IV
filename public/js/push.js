//https://www.npmjs.com/package/web-push
const public_key = "BFcl4HfqyxWx8Drs2LB5r_78VrxOVEIDZHpEVun8hLR8pDP690ZL7hECyJh3RndxSoyKb8pS69LSahTRf7d46tI";
if( 'serviceWorker' in navigator ){
    navigator.serviceWorker.register("/js/sw.js").then(reg=>{
        console.log("Registrando el servicio de NOtificaciones PUSH");
        if(reg.installing){
            console.log("Instalando proceso en segundo plano");
        }else if(reg.waiting){
            console.log("Esperando proceso de instalacion");
        } else if(reg.active){
            console.log("Servicio de Notificaciones PUSH instalado y LISTO para usarse");
            suscribirse(reg);
        } else {
            console.log("Error al intentar registrar las notificaciones PUSH");
        }
    });
} else {
    alert("Lo siento tu navegador NO soporta registro de notificaciones PUSH");
}

function suscribirse(reg){
    reg.pushManager.subscribe({
        userVisibleOnly:true,
        applicationServerKey:urlBase64ToUint8Array(public_key)
    }).then(subscription=>{
        console.log("enviando la subscripcion al servidor", JSON.stringify(subscription));
        socket.emit('subscription', JSON.stringify(subscription));
    }).catch(error=>{
        if(Notification.permission==='denied'){
            console.log("NO hay permiso para registrar las notificaciones");
        }else{
            console.log("NO pude registrar las notificaciones PUSH", error);
        }
    });
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
   
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
   
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }