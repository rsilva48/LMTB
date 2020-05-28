const tmi = require('tmi.js');
const path = require('path');
const fs = require('fs');
var songfiles = [];
var songnames = [];
var songsjson = [];
var decisiones = [];

//Settings
const settings = require(process.cwd() + '/settings.js'); //import settings.js
const mp = settings.mp;
const mdirs = settings.mdirs;
const channelname = settings.channelname;
const botUsername = settings.botUsername;
const oauthpass = settings.oauthpass
const chatOutput = settings.chatOutput;
const debugOutput = settings.debugOutput;
const decisionDebug = settings.decisionDebug;
const searchDebug = settings.searchDebug;
const conmsg = settings.conmsg;
const ignorebot = settings.conmsg;
const suffix = settings.suffix;
const testcmnd = settings.testcmnd;
const testresponse = settings.testresponse;
const selfilesext = settings.selfilesext;
const conOutput = settings.conOutput;
//End of Settings

//File Extensions
var filesext = []
const vidext = ['.mp4', '.mkv', '.flv', '.webm','.avi','.wmv','.mgp','.mpeg'];
const audext = ['.mp3', '.mka', '.flac', '.wav', '.aac', '.ogg', '.mp2', '.ac3'];
if (selfilesext === 'both'){
  filesext = vidext.concat(audext);
} else if (selfilesext === 'audio') {
  filesext = audext;
} else if (selfilesext === 'video'){
  filesext = vidext
} else {
  filesext =[]
}


//TMI Settings
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

//Create TMI Client
const client = new tmi.client(options);

//Scans each Media Directory
mdirs.forEach(function(mdir){
  fs.readdir(mdir, function (err, archivos){
    if (err)
    {return console.log('Error al escanear el directorio' + err);}
    if(debugOutput){console.log('Lista de archivos:')}
    var i=0;
    archivos.forEach(function (archivo.toLowerCase()){
      var ext = path.extname(archivo);
      var basesong = path.basename(archivo, ext);
      if (ext.startsWith('.'))
      {
        filesext.forEach(function(searchext.toLowerCase()){
          if (searchext == ext){
            songfiles.push(archivo);
            if(debugOutput){console.log(`[${i+1}]. ${basesong}`);}
            var songjson = {
              id: i,
              name: basesong,
              extension: ext,
              dir: mdir
            };
            songsjson.push(songjson);
            if (searchDebug){console.log('json:');
            console.log(songjson);}
            songnames.push(basesong);
            i+=1;
          }
        })
      }
    }
  )
  if(searchDebug){console.log(songsjson);}
  });
})

//Add selected file to the player queue
function addtoqueue (filejson) {
  //Media Player Commands
  var pp = `"${mp}" "${filejson.dir}${filejson.name}${filejson.extension}" /add`;
  var mpc = `"${mp}" "${filejson.dir}${filejson.name}${filejson.extension}" /add /fullscreen`;
  var { exec } = require("child_process");
  if (path.basename(mp) == 'mpc-hc64.exe' || path.basename(mp) == 'mpc-hc.exe')
    {console.log(`* ${mpc}`);
    exec(mpc);}
  if (path.basename(mp) == 'PotPlayerMini64.exe' || path.basename(mp) == 'PotPlayerMini.exe')
    {console.log(`* ${pp}`);
    exec(pp);}
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
  if (ignorebot){if(self) {return;} //Ignora bot messages
  if (tags.username == botUsername.toLowerCase()) {
    return;
  };}

  function comandos(comando){
    console.log(`* Comando: ${comando}`);
  };



  const comando = msg.trim().toLowerCase();

  //Test Command
  if(comando === `${suffix}${testcmnd}`) {
    comandos(comando);
    if (chatOutput && conOutput){client.say(channel, `${testresponse} @${tags.username}`);}
    console.log(`* ${tags.username} ${testcmnd} ${testresponse}`);
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
          songsjson.forEach(function(song){
            if (song.name+song.extension == elecciones){
              addtoqueue(song);
            }
          })
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

  if (comando.startsWith(`${suffix}play `)) {
    comandos(comando);

    if (decisiones.length >= 1){
      decisiones.forEach(function(decision, i){
        if (decision.username == tags.username){
          if (chatOutput){
            client.say(channel, `@${tags.username} Tienes una cancion pendiente por elegir.`);
            client.say(channel, `@${tags.username} hay varios resultados para  "${decision.busqueda}": ${decision.opciones}\n. Cual desea reproducir?`);
            return;
          }
        }
      })
    }

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
    } else if (resultados.length == 1) {
      songsjson.forEach(function(song){
        if (song.name+song.extension == resultados[0]){
          addtoqueue(song);
        }
      })
    var ext = path.extname(resultados[0]);
    if (chatOutput){client.say(channel, `@${tags.username} ha añadido ${path.basename(resultados[0], ext)} a la cola.`);}
    console.log(`* ${tags.username} añadio ${path.basename(resultados[0], ext)}" a la cola.`);
  } else if (resultados.length > 1) {
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
    else {
      if (debugOutput) {
        console.log('Error')
      }
    }
    return;
  }
};
