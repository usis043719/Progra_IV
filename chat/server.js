const port = 3001;

const http = require('http').Server(), 
    express = require("express"),
    fs = require('fs'),
    Files = {},
    io = require('socket.io')(http,{
        allowEIO3: true,
        cors: {
            origin: ["http://localhost:8000"],
            credentials : true
        }
    }),
    app = express(),
    cors = require('cors'),
    mongodb = require('mongodb').MongoClient,
    url = 'mongodb://localhost:27017',
    dbname = 'chatDB',
    webpush = require('web-push'), //https://www.npmjs.com/package/web-push
    vapidKeys = {
        publicKey:'BFcl4HfqyxWx8Drs2LB5r_78VrxOVEIDZHpEVun8hLR8pDP690ZL7hECyJh3RndxSoyKb8pS69LSahTRf7d46tI',
        privateKey:'GEJLIqRPJdzZBd1qWpANmQAWbEZl9C5A0vQGu_fdpgk'
    };
var pushSubscription; //Esta subscripcion debemos almacenarla en una BD;
webpush.setVapidDetails("mailto:luishernandez@ugb.edu.sv", vapidKeys.publicKey, vapidKeys.privateKey);

http.listen(port,()=>{
    console.log("Ejecutanse nuestra app con socket.io en node por el puerto", port);
});

io.on('connection', socket=>{
    console.log("Usuarios conectados via socket...");
    socket.on('chat',chat=>{
        mongodb.connect(url,(err, client)=>{
            if(err) console.log( "NO fue posible conectarse a la base de datos",err );
            const db = client.db(dbname);
            db.collection("chat").insertOne(chat).then((result)=>{
                io.emit('chat',chat);//envia a todos
                try{
                    const data = JSON.stringify({title:chat.from, msg:chat.msg});
                    webpush.sendNotification(pushSubscription, data);
                }catch(e){
                    console.log("Error al enviar notificacion PUSH", e);
                }
            });
        });
    });
    socket.on('historial',()=>{
        mongodb.connect(url,(err, client)=>{
            if(err) console.log( "NO fue posible conectarse a la base de datos",err );
            const db = client.db(dbname);
            db.collection("chat").find({}).toArray((err, msgs)=>{
                socket.emit('historial',msgs);//envia solo a quien solicita la informacion
            });
        });
    });
    socket.on('subscription',subscription=>{
        pushSubscription = JSON.parse(subscription);
        console.log("subscripcion: ", subscription);
    });
    socket.on('envio_archivos', data=> {
        var Name = data['msg'];
        Files[Name]['Downloaded'] += data['Data'].length;
        Files[Name]['Data'] += data['Data'];
        if (Files[Name]['Downloaded'] == Files[Name]['FileSize']) { //If File is Fully Uploaded
            fs.write(Files[Name]['Handler'], Files[Name]['Data'], null, 'Binary', function (err, Writen) {
                mongodb.connect(url,(err, client)=>{
                    if(err) console.log( "NO fue posible conectarse a la base de datos",err );
                    const db = client.db(dbname);
                    data['Data'] = null;
                    db.collection("chat").insertOne(data).then((result)=>{
                        io.emit('chat',data);//envia a todos
                        try{
                            const noti = JSON.stringify({title:data.from, msg:data.msg});
                            webpush.sendNotification(pushSubscription, noti);
                        }catch(e){
                            console.log("Error al enviar notificacion PUSH", e);
                        }
                    });
                });
            });
        } else if (Files[Name]['Data'].length > 10485760) { //If the Data Buffer reaches 10MB
            fs.write(Files[Name]['Handler'], Files[Name]['Data'], null, 'Binary', function (err, Writen) {
                Files[Name]['Data'] = ""; //Reset The Buffer
                var Place = Files[Name]['Downloaded'] / 524288;
                var Percent = (Files[Name]['Downloaded'] / Files[Name]['FileSize']) * 100;
                socket.emit('MoreData', {
                    'Place': Place,
                    'Percent': Percent
                });
            });
        } else {
            var Place = Files[Name]['Downloaded'] / 524288;
            var Percent = (Files[Name]['Downloaded'] / Files[Name]['FileSize']) * 100;
            socket.emit('MoreData', {
                'Place': Place,
                'Percent': Percent
            });
        }
    });
    socket.on('inicio_envio_archivos', data=>{
        var Name = data['Name'];
        let ruta = __dirname.slice(0,-4);
        Files[Name] = { //Create a new Entry in The Files Variable
            FileSize: data['Size'],
            Data: "",
            Downloaded: 0
        }
        var Place = 0;
        try {
            var Stat = fs.statSync(ruta + '/public/archivos/' + Name);
            if (Stat.isFile()) {
                Files[Name]['Downloaded'] = Stat.size;
                Place = Stat.size / 524288;
            }
        } catch (er) {
            console.log(er);
        } //It's a New File

        fs.open(ruta + "/public/archivos/" + Name, 'a', 0755, function (err, fd) {
            if (err) {
                console.log(err);
            } else {
                Files[Name]['Handler'] = fd; //We store the file handler so we can write to it later
                socket.emit('MoreData', {
                    'Place': Place,
                    Percent: 0
                });
            }
        });
    });
});

/*app.use(cors());
app.use(express.json());

app.post("/chat",(req, resp)=>{
    mongodb.connect(url,(err, client)=>{
        if(err) console.log( "NO fue posible conectarse a la base de datos",err );
        const db = client.db(dbname);
        db.collection("chat").insertOne(req.body).then((result)=>{
            resp.send( result );
        });
    });
});
app.get("/historial",(req, resp)=>{
    mongodb.connect(url,(err, client)=>{
        if(err) console.log( "NO fue posible conectarse a la base de datos",err );
        const db = client.db(dbname);
        db.collection("chat").find({}).toArray((err, msgs)=>{
            resp.send( msgs );
        });
    });
});

app.listen(port,()=>{
    console.log("Ejecutanse nuestra app con express en node por el puerto", port);
});*/