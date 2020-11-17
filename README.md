<div align="center">

# Anime Openings Quiz Bot

[Installation](#Installation) • [How to Use](#How-to-Use) • [Commands](#Commands)

---

## Installation

</div>

##### Prerequisite

- To use this bot, Node.js 12.0.0 or newer must be [installed](https://nodejs.org/en/download/).

##### Downloading and installing steps

1.  **[Download](https://github.com/jay1934/Anime-Openings/archive/main.zip)** the `zip` file.

2.  Configure the Bot:

    - Run `npm install`
    - You will need to [create a bot application](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot) in the **[developers space](https://discordapp.com/developers/applications/me)**
    - Enable both Priviledged Intents

3.  Invite the Bot to your Server:

    - In your bot's application page, navigate to [OAUTH2](https://discord.com/developers/applications/771430839250059274/oauth2)
    - In the "scopes" section, select `bot`
    - In the "bot permission" section, select:

      - `ADMINISTRATOR`

      This will account for permissions needed on all three features.

    - Copy and paste the generated invite link!

4.  Get the Bot Online
    - Run `node index.js`
    - **The bot is now operational ! 🎉**

<br>

---

<div align="center">

## How to Use

</div>

First, you need to fill in all of the values in [`config.json`](/config.json). In this case, it's just your bot token and a list of `points:role` properties. If a user gets the required amount of points, the role with the corresponding ID will be given to them. For example:

```json
{
  "roleRewards": {
    "10": "1234567890",
    "50": "1234567890",
    "150": "1234567890"
  },
  "token": "Nzc1NzAwOTU1NDc4OPogChampYouFoundASecretzw.kC8rs9qP3qCCb4SzRW2LOaLxsrQ"
}
```

**Make sure the bot's role is above any you want to assign**. That's basically all the configuration setup needed, everything else works out of the box!

<br>

This bot mainly consists of one feature: the [`Quiz`](/classes/quiz). When the appropriate command is executed, a new `Quiz` will be created, and all other commands will reference that `Quiz` until it ends. There are two _modes_ to the quiz.

- Normal (`+play`) - The bot plays a song and gives you thirty seconds to name the title of the song _or_ the anime in the text channel. After 30 seconds, it skips automatically. You can set a goal through the command, such as `5`, and the bot will end the game once someone reaches `5` points. If someone guess correctly, A point is given to them in the quiz scoreboard _and_ the global scoreboard.

- Freeplay (`+freeplay`) - No competition or 30 second snippets; the bot just plays a random anime opening all the way through and then skips to the next one until you tell it to stop. Useful for background music.

---

<div align="center">

## Commands

```

[] - Optional
<> - required

```

|   Name    |     Usage      |                                    Description                                    |
| :-------: | :------------: | :-------------------------------------------------------------------------------: |
|   Play    | `+play [goal]` |                              Starts a standard quiz                               |
| Freeplay  |  `+freeplay`   |              Get a list of commands (and keep track of usage count)               |
|   Skip    |    `+skip`     |          Skips a song. Requires at least half of participants to agree.           |
| Forceskip |  `+forceskip`  | Skip a song, bypassing need for people to agree. Only usable by the Quiz creator. |
|    End    |     `+end`     |              Ends the quiz, and shows the winner if in standard mode              |

**Note: If `+play` crashes your bot and gives an error such as `FFmpeg/avconv not found!`, download [this zip file](https://github.com/BtbN/FFmpeg-Builds/releases/download/autobuild-2020-11-09-12-46/ffmpeg-n4.3.1-25-g1936413eda-win64-gpl-4.3.zip) and extract the folder to anywhere in your hosting environment**

</div>
```
