const mp = "C:\\Program Files\\MPC-HC\\mpc-hc64.exe";
//const mp = "C:\\Program Files\\DAUM\\PotPlayer\\PotPlayerMini64.exe";
const mdir = "C:\\Users\\Roger\\Videos\\";
const channelname = 'TheMisterDeku'
const tmi = require('tmi.js');
const path = require('path');
const fs = require('fs');
var songfiles = [];
var decisiones = [];

const options = {
  options: {
    debug: true,
  },
  connection: {
    cluster: 'aws',
    reconnect: true,
  },
  identity:{
    username: 'H48Bot',
    password: 'oauth:1niukiru6qiy86cfvgzmjla3ed74lo'
  },
  channels: [channelname],
};

const client = new tmi.client(options);

fs.readdir(mdir, function (err, archivos){
  if (err)
  {return console.log('Error al escanear el directorio' + err);}
  console.log('Lista de archivos:')
  var i=0;
  archivos.forEach(function (archivo){
    if (archivo.substr(-4).startsWith('.'))
    {songfiles.push(archivo);
      var ext = path.extname(archivo);
      console.log(`[${i+1}]. ${path.basename(archivo, ext)}`);
    i+=1;}
  })
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
  client.action(channelname, 'Buenas, H48Bot esta conectado, creado por @Harunoki__48.');
};

function mensaje (channel, tags, msg, self) {
  if(self) {return;} //Ignora los mensajes propios
  if (tags.username == "h48bot") {
    return;
  }

  const comando = msg.trim().toLowerCase();
  console.log(`* Comando: ${comando}`)
  if(comando === '!hola') {
    client.say(channel, `Hola! @${tags.username}`);
    console.log(`* ${tags.username} ha saludado!`);
  }

  if (decisiones.length >= 1){
    /*console.log('\n* Decisiones length:');
    console.log(decisiones.length);
    console.log('Seleccion:')*/
    decisiones.forEach(function(decision, i){
      //console.log(decision.username);
      if (decision.username == tags.username)
      {decision.opciones.forEach(function(elecciones, j){
        //console.log(j + ' ' + elecciones)
        if (comando == j+1){
          addtoqueue(elecciones);
          var ext = path.extname(elecciones);
          client.say(channel, `@${tags.username} ha añadido ${path.basename(elecciones, ext)} a la cola.`);
          console.log(`* ${tags.username} añadio ${path.basename(elecciones, ext)}" a la cola.`);
          /*console.log('Busqueda');
          console.log(decision.busqueda)*/
          decisiones = decisiones.filter(function(value, index, arr){
            /*console.log('* filter value:');
            console.log(value.busqueda);*/
            return !(value.busqueda == decision.busqueda);
          })
        }

      })}

    })
  }

  if (comando.startsWith('!play ')) {
    var busqueda = comando.substr(6);
    if (busqueda == '' || busqueda == ' ') {
      client.say(channel, `@${tags.username} no has especificado que deseas reproducir, intenta nuevamente.`);
      console.log(`* ${tags.username} dejo el comando play vacio.`);
      return;
    }
    var resultados = songfiles.filter(function (archivo) { return archivo.includes(busqueda);})
    console.log('\n* Resultados:')
    console.log(resultados)

    if (resultados.length == 0 || resultados === undefined) {
      client.say(channel, `@${tags.username} no se encontraron resultados para "${busqueda}".`);
      console.log(`* ${tags.username} busco "${busqueda}" sin resultados.`);
    }

    if (resultados.length == 1) {
    addtoqueue(resultados[0]);
    var ext = path.extname(resultados[0]);
    client.say(channel, `@${tags.username} ha añadido ${path.basename(resultados[0], ext)} a la cola.`);
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
    /*console.log('\n* Decisiones:');
    console.log(decisiones)
    console.log('\n* Decisiones length:');
    console.log(decisiones.length);*/
    client.say(channel, `@${tags.username} hay varios resultados para  "${busqueda}": ${opciones}\n. Cual desea reproducir?`);
    console.log(`* ${tags.username} busco "${busqueda}" con varios resultados.`);
    }
  }
};
