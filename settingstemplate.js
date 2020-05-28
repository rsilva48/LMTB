//Edit the configuration file and rename this file to settings.js if it have other name.

//Media settings
//Media player executable paths, only leave one of both uncommented. (Without "//" at the beggining of the line)
const mp = "C:\\Program Files\\MPC-HC\\mpc-hc64.exe"; //Media Player Classic.
//const mp = "C:\\Program Files\\DAUM\\PotPlayer\\PotPlayerMini64.exe"; //PotPlayer.
//Media directories. (Where the files are stored, put double backslash insted of one, backslash at the end is mandatory)
const mdirs = ["C:\\Users\\Harunoki__48\\Videos\\", "C:\\Users\\Harunoki__48\\Music\\"];

//Bot settings
const channelname = 'Harunoki__48'; //Twitch.tv channel name.
const botUsername = 'H48Bot'; //Twitch bot account username.
const oauthpass = 'oauth:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; //Generate oauthpass here: https://twitchapps.com/tmi/
const chatOutput = true; //Enables or disable the bot output on the chat.
const debugOutput = false; //Enables or disable the bot debug output on console.
const decisionDebug = false; //Enables or disable the bot debug output on console related to the decisions when bot returns multiple results.
const searchDebug = false; //Enables or disable the bot debug output on console related to the file search results.
const ignorebot = true; //Enable or disables if the messages sent by the bot are ignored.
const conOutput = true; //Enable or disables connection messages on chat.

//Personalization
const suffix = '!'; //Change the suffix for the commands, by defaut they start with!
const testcmnd = 'ping'; //Change the test command
const testresponse = 'pong!'; //Change the message send as a response to the test command
const selfilesext = 'both' //To select which files search, can be: both, audio, video.
//Set startup messages to be send when connected.
const conmsg = [`Greetings, ${botUsername} is connected, created by @Harunoki__48.`, `To add a file to the queue use the command "${suffix}play" then the name of the file.`]


module.exports={
  mp,
  mdirs,
  channelname,
  botUsername,
  oauthpass,
  chatOutput,
  debugOutput,
  decisionDebug,
  searchDebug,
  conmsg,
  ignorebot,
  suffix,
  testcmnd,
  testresponse,
  selfilesext,
  conOutput
}
