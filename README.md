# LocalMediaTwitchBot
Twitch Bot that adds to a playlist or player queue, files that are locally stored on a drive.

Supported players: MPC-HC and PotPlayer.

## Installation & use

### Downloading releases

* Download the release for your OS here: https://github.com/rsilva48/LocalMediaTwitchBot/releases/latest.

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

Example:
```
!play some song
```
