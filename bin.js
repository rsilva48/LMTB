const tmi = require('tmi.js');
const path = require('path');
const fs = require('fs');
var songfiles = [];
var songnames = [];
var songsjson = [];
var decisiones = [];

const settings = require(process.cwd() + '/settings.js'); //import settings
//Settings
const mp = settings.mp;
const mdir = settings.mdir;
const channelname = settings.channelname;
const botUsername = settings.botUsername;
const oauthpass = settings.oauthpass
const chatOutput = settings.chatOutput;
const debugOutput = settings.debugOutput;
const decisionDebug = settings.decisionDebug;
const searchDebug = settings.searchDebug;
const conmsg = settings.conmsg;
const ignorebot = settings.conmsg;
//End of Settings

const options = {
  options: {
    debug: debugOutput,
  },
  connection: {
    cluster: 'aws',
    reconnect: true,
  },
  identity:{
    username: botUsername,
    password: oauthpass
  },
  channels: [channelname],
};

const client = new tmi.client(options);

fs.readdir(mdir, function (err, archivos){
  if (err)
  {return console.log('Error al escanear el directorio' + err);}
  if(debugOutput){console.log('Lista de archivos:')}
  var i=0;
  archivos.forEach(function (archivo){
    if (archivo.substr(-4).startsWith('.'))
    {songfiles.push(archivo);
      var ext = path.extname(archivo);
      var basesong = path.basename(archivo, ext);
      songnames.push(basesong);
      if(debugOutput){console.log(`[${i+1}]. ${basesong}`);}
      if(searchDebug){var songjson = {
        id: i+1,
        nombre: basesong,
        extension: ext,
      };
      songsjson.push(songjson);}
      if (searchDebug){console.log('json:');
      console.log(songjson);}
    i+=1;}
  }
)
if(searchDebug){console.log(songsjson);}
});


function addtoqueue (filename) {
  var { exec } = require("child_process");
  if (path.basename(mp) == 'mpc-hc64.exe' || path.basename(mp) == 'mpc-hc.exe')
    {console.log(`* "${mp}" "${mdir}${filename}" /add /fullscreen`);
    exec(`"${mp}" "${mdir}${filename}" /add /fullscreen`);}
  if (path.basename(mp) == 'PotPlayerMini64.exe' || path.basename(mp) == 'PotPlayerMini.exe')
    {console.log(`* "${mp}" "${mdir}${filename}" /add`);
    exec(`"${mp}" "${mdir}${filename}" /add`);}
};


client.on('message', mensaje);
client.on('connected', conectado);

client.connect();

function conectado (address, port) {
  conmsg.forEach(function(msg){
    if (chatOutput){client.action(channelname, msg);}
  })
};

function mensaje (channel, tags, msg, self) {
  if (ignorebot){if(self) {return;} //Ignora los mensajes propios
  if (tags.username == botUsername.toLowerCase()) {
    return;
  };}

  function comandos(comando){
    console.log(`* Comando: ${comando}`);
  };



  const comando = msg.trim().toLowerCase();
  if(comando === '!hola') {
    comandos(comando);
    if (chatOutput){client.say(channel, `Hola! @${tags.username}`);}
    console.log(`* ${tags.username} ha saludado!`);
  };

  if (decisiones.length >= 1){
    if (decisionDebug) {console.log('\n* Decisiones length:');
    console.log(decisiones.length);
    console.log('Seleccion:')}
    decisiones.forEach(function(decision, i){
      if (decisionDebug) {console.log(decision.username);}
      if (decision.username == tags.username)
      {decision.opciones.forEach(function(elecciones, j){
        if (decisionDebug){console.log(j + ' ' + elecciones)}
        if (comando == j+1){
          addtoqueue(elecciones);
          var ext = path.extname(elecciones);
          if (chatOutput){client.say(channel, `@${tags.username} ha añadido ${path.basename(elecciones, ext)} a la cola.`);}
          console.log(`* ${tags.username} añadio ${path.basename(elecciones, ext)}" a la cola.`);
          if (decisionDebug){console.log('Busqueda');
          console.log(decision.busqueda)}
          decisiones = decisiones.filter(function(value, index, arr){
            if (decisionDebug){console.log('* filter value:');
            console.log(value.busqueda);}
            return !(value.busqueda == decision.busqueda);
          })
        }

      })}

    })
  }

  if (comando.startsWith('!play ')) {
    comandos(comando);
    var busqueda = comando.substr(6);
    if (busqueda == '' || busqueda == ' ') {
      if (chatOutput){client.say(channel, `@${tags.username} no has especificado que deseas reproducir, intenta nuevamente.`);}
      console.log(`* ${tags.username} dejo el comando play vacio.`);
      return;
    }

    if (searchDebug){songnames.forEach(function(song){
      console.log(song.toLowerCase())
      console.log(song.toLowerCase().includes(busqueda))
    })
  }


    var resultados = songfiles.filter(function (archivo) { return archivo.toLowerCase().includes(busqueda);})
    console.log('\n* Resultados:')
    console.log(resultados)

    if (resultados.length == 0 || resultados === undefined) {
      if (chatOutput){client.say(channel, `@${tags.username} no se encontraron resultados para "${busqueda}".`);}
      console.log(`* ${tags.username} busco "${busqueda}" sin resultados.`);
    }

    if (resultados.length == 1) {
    addtoqueue(resultados[0]);
    var ext = path.extname(resultados[0]);
    if (chatOutput){client.say(channel, `@${tags.username} ha añadido ${path.basename(resultados[0], ext)} a la cola.`);}
    console.log(`* ${tags.username} añadio ${path.basename(resultados[0], ext)}" a la cola.`);
    }

    if (resultados.length > 1) {
      var opciones = '';
      resultados.forEach(function(cancion, i){
        var ext = path.extname(cancion);
        opciones += `\n[${i+1}]. ${path.basename(cancion, ext)},`;
      })
    decisiones.push({
      'username':`${tags.username}`,
      'opciones':resultados,
      'busqueda':busqueda,
    });
    if (decisionDebug){console.log('\n* Decisiones:');
    console.log(decisiones)
    console.log('\n* Decisiones length:');
    console.log(decisiones.length);}
    if (chatOutput){client.say(channel, `@${tags.username} hay varios resultados para  "${busqueda}": ${opciones}\n. Cual desea reproducir?`);}
    console.log(`* ${tags.username} busco "${busqueda}" con varios resultados.`);
    }
  }
};
