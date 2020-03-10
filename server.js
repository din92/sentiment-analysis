let express = require("express");
let bodyParser = require("body-parser");
let path = require("path");
let app = express();
let router = express.Router();
require("dotenv").config();
//setting up common variable and routes;
let common={};
common.utils =require("./utils")(common);
require("./routes")(common);
app.use(router);
let env = process.argv[2];

common.pythonFile=process.argv[3];

/*handling sockets*/
let server = require("http").createServer(app);
let io = require("socket.io")(server);
let sw = require("socketio-wildcard")();
let session = require("express-session")({
    secret: "my-secret",
    resave: true,
    saveUninitialized: true,
    "cookie": {"path": '/', "httpOnly": false, "secure": false, "maxAge": null}
});
let sharedsession = require("socket.io-express-session");

// Use express-session middleware for express
app.use(session);

// Use shared session middleware for socket.io
// setting autoSave:true
io.use(sharedsession(session, {
    autoSave:true
}));

let logicio=io.of("/logicio");
logicio.use(sw);
logicio.on('connection',(socket)=>{
    socket.on("*",(packet)=>{
        let p = packet.data[0];
        let reqData = packet.data[1];

        let [apiKey,method]=p.split('->');
        let backend =common.routes[apiKey];
        if(backend && backend[method] && typeof backend[method] ==='function'){
            backend[method]({socket,respond(response){
                socket.emit(p+':' + reqData.reqId + ':reply',response);
            }},reqData.data);
        }

    });
});
/*Socket handling end*/


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,"/src")));
app.set("views",path.join(__dirname,"/views"));
app.set("view engine","ejs");

app.set("PORT",5000);

router.get("/",(req,res)=>{
    res.render("main");
});



server.listen(app.get("PORT"),()=>{
    console.log("server is listening");
});






