const { MessageEmbed } = require('discord.js');
const https = require('https');
const fs = require('fs');
const getMP3Duration = require('get-mp3-duration');

module.exports = {
  match: 'add(song|op(ening)?)',
  async execute({ error, author: credits, songs, write }, message) {
    // if you'd like to restrict this command,
    // uncomment the snippet below and past in one of the permission flags shown here:
    // https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS

    // if (!message.member.hasPermission('PERMISSION'))
    //   return error('Insufficient Permissions', message)

    const next = () =>
      message.channel.awaitMessages(
        ({ author }) => author.id === message.author.id,
        { max: 1 }
      );
    const embed = () =>
      new MessageEmbed()
        .setColor('GREEN')
        .setAuthor(...credits(message.author));
    let msg = await message.channel.send(
      embed()
        .setTitle('Please provide the name of the anime the opening is from')
        .setDescription("For example:\n```\nJoJo's Bizarre Adventure\n```")
    );
    const anime = (await next()).first().content;
    await msg.delete();
    msg = await message.channel.send(
      embed()
        .setTitle('Please provide a valid RegExp to match the anime name!')
        .setDescription(
          "For example:\n```\nJoJo'?s Bizarre Adventure\n```\nMake sure you escape any special characters you want to be literal!\nRemember that even though backslashes might seem greyed out when typing them, and look invisible after sending the message, it will still register\nAlso, please don't include `^` or `$` in your RegExp, as they will be automatically added"
        )
        .setFooter("Capatalization doesn't matter!")
    );
    let animeMatch;
    while (true) {
      animeMatch = (await next()).first().content;
      try {
        new RegExp(`^${animeMatch}$`, 'i');
        break;
      } catch (e) {
        error("That's not a valid RegExp! Try again.", message);
        continue;
      }
    }
    await msg.delete();
    msg = await message.channel.send(
      embed()
        .setTitle('Please provide the name of the opening song')
        .setDescription('For example:\n```\nOp 1: "Bloody Stream"\n```')
    );
    const song = (await next()).first().content;
    await msg.delete();
    msg = await message.channel.send(
      embed()
        .setTitle(
          'Please provide a valid RegExp to match the opening song name!'
        )
        .setDescription(
          'For example:\n```\nBloody Stream\n```\nMake sure you escape any special characters you want to be literal!'
        )
        .setFooter("Capatalization doesn't matter!")
    );
    let songMatch;
    while (true) {
      songMatch = (await next()).first().content;
      try {
        new RegExp(`^${songMatch}$`, 'i');
        break;
      } catch (e) {
        error("That's not a valid RegExp! Try again.", message);
        continue;
      }
    }
    await msg.delete();
    msg = await message.channel.send(
      embed().setTitle("Please provide the song author's name")
    );
    const author = (await next()).first().content;
    await msg.delete();
    msg = await message.channel.send(
      embed()
        .setTitle(
          'Please reply with an attachment of the `.mp3` or `.mp4` file'
        )
        .setDescription('Try to make it above 30 seconds in length')
    );
    let file;
    while (true) {
      file = (await next()).first().attachments.first();
      if (!file) {
        error("You didn't attach any files! Try again", message);
        continue;
      }
      if (!/.mp[34]$/.test(file.url)) {
        error("That's not a `.mp3` or `.mp4` file! Try again", message);
        continue;
      }
      break;
    }
    if (fs.existsSync(`./musicfile.name}`)) {
      message.channel.send(
        'A file with the same name already exists, so the file name will be modified'
      );
      for (let count = 1; fs.existsSync(`./music/${file.name}`); count++) {
        file.name = `${file.name.split(/.mp[34](-\d+?)?$/)[0]}-${count}.mp3`;
      }
    }
    https.get(file.url, async (response) => {
      const writer = fs.createWriteStream(`./music/${file.name}`);
      writer.on('finish', async () => {
        const duration = getMP3Duration(
          fs.readFileSync(`./music/${file.name}`)
        );
        if (duration < 30000)
          return error(
            'Your file is less than thirty seconds. Command canceled.',
            message
          );
        await msg.delete();
        const data = {
          author,
          file: file.name.split(/.mp[34]$/)[0],
          anime,
          song,
          animeMatch,
          songMatch,
          duration,
        };
        message.channel.send(
          embed()
            .setTitle(`${anime} ${song} by ${author} has been added!`)
            .setDescription(
              `New data:\n\`\`\`json\n${JSON.stringify(data, '', 2)}\n\`\`\``
            )
        );
        write([...songs, data].sort((a, b) => a.anime.localeCompare(b.anime)));
      });
      message.channel.send(embed().setTitle('Downloading the file...'));
      response.pipe(writer);
    });
  },
};
