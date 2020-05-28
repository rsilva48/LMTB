# Local Media Twitch Bot
Twitch Bot that adds files that are locally stored on a drive to a media player playlist or queue.

Supported players: MPC-HC and PotPlayer.

## Installation & use

### Downloading releases

* Download the latest release here: https://github.com/Harunoki/LocalMediaTwitchBot/releases/latest/ or selecting your platform below:
  * **Windows**: https://github.com/Harunoki/LocalMediaTwitchBot/releases/latest/download/Win.zip
  * **Linux**: https://github.com/Harunoki/LocalMediaTwitchBot/releases/latest/download/Linux.zip
  * **macOS**: https://github.com/Harunoki/LocalMediaTwitchBot/releases/latest/download/macOS.zip

* Extract the .zip file and modify **settings.js**.

* Then just run the executable file.


### Using source code

* First, install Node.js, you can get it here: https://nodejs.org/.

* Then modify the **settingstemplate.js** and save it as **settings.js**.


To install the dependencies use the following command on the CLI:
```
npm install
```


To run the bot use the following command on the CLI:
```
node index.js
```

### Commands

* **!play** - To add a file to the queue use the command followed by the name of the file.
* **!ping** - Test command that returns pong! to the chat, can be changed in settings.js file.

Example:
```
!play some song
!ping //Returns pong! @username
```

## Credits

* This project use **tmi.js**: https://tmijs.com/.

* Twitch Chatbot Documentation: https://dev.twitch.tv/docs/irc/.

* Binaries created using **pkg**: https://github.com/vercel/pkg/.
