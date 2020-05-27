//Settings
//Media player executable paths, only leave one of both uncommented. (With "//" at the beggining of the line)
const mp = "C:\\Program Files\\MPC-HC\\mpc-hc64.exe"; //Media Player Classic.
//const mp = "C:\\Program Files\\DAUM\\PotPlayer\\PotPlayerMini64.exe"; //PotPlayer.
const mdir = ""; //Media directory. (Where the files are stored)
const channelname = ''; //Twitch.tv channel name.
const botUsername = ''; //Twitch bot account username.
const oauthpass = ''; //Generate oauthpass here: https://twitchapps.com/tmi/
const chatOutput = true; //Enables or disable the bot output on the chat.
const debugOutput = false; //Enables or disable the bot debug output on console.
const decisionDebug = false; //Enables or disable the bot debug output on console related to the decisions when bot returns multiple results.
const searchDebug = false; //Enables or disable the bot debug output on console related to the file search results.
const conmsg = [`Greetings, ${botUsername} is connected, created by @Harunoki__48.`, `To add a file to the queue use the comnand "!play" then the name of the file.`] //Set startup messages to be send when connected.
const ignorebot = true;
//End of Settings

module.exports={
  mp,
  mdir,
  channelname,
  botUsername,
  oauthpass,
  chatOutput,
  debugOutput,
  decisionDebug,
  searchDebug,
  conmsg,
  ignorebot
}
