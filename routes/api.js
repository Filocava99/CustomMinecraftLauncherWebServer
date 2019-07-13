const mysql     = require('mysql2');
const request   = require('request');

var accessToken = "";
var uuid = "";

function mojangAuthentication(username,password){
    var content = {
        "agent": {                              // defaults to Minecraft
            "name": "Minecraft",                // For Mojang's other game Scrolls, "Scrolls" should be used
            "version": 1                        // This number might be increased
                                                // by the vanilla client in the future
        },
        "username": "james.production9@gmail.com",           // Can be an email address or player name for
        // unmigrated accounts
        "password": "soul-network-italia.10.0654.YhFRBvNMilI",
        "requestUser": true                     // optional; default: false; true adds the user object to the response
    }

    var options = {
        url: 'https://authserver.mojang.com/authenticate',
        method: 'POST',
        headers: {
            'Content-Type' : "application/json",
            "Accept-Charset" : "UTF-8",
        },
        json: content
    };
    request(options,function (err, response, body) {
        if(err){
            return;
        }
        if(response.statusCode != '200'){
            return;
        }
        accessToken = body.accessToken;
        uuid = body.selectedProfile.id;
    });
}

mojangAuthentication();
setInterval(mojangAuthentication,1000*60*28);

module.exports = function (app) {
   app.get("/info",function (req, res) {
       var version = "1.0";

       con = mysql.createConnection({
           host: 'localhost',
           database: 'Launcher',
           user: 'launcher',
           password: 'erBCfGIKEH1zwSRi'
       });

       con.execute('SELECT * FROM Packet ORDER BY Name',function (err,result) {
           if(err)
               throw err;
           res.json({version: version, forceUpdate: false, path_win: "http://soulnetwork.it/launcher/versions/win.zip",path_osx: "http://soulnetwork.it/launcher/versions/osx.zip",modpacks: result});
           con.destroy();
           return;
       });
   });

   app.get("/token",function (req,res) {
       res.json({accessToken: accessToken,uuid: uuid});
   });

};