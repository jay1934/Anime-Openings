const { MessageEmbed } = require('discord.js');

module.exports = {
  match: '(remove|delete)(song|op(ening)?)',
  async execute({ error, author, songs, write }, message, match) {
    // if you'd like to restrict this command,
    // uncomment the snippet below and past in one of the permission flags shown here:
    // https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS

    // if (!message.member.hasPermission('PERMISSION'))
    //   return error('Insufficient Permissions', message)

    const index = songs.findIndex((opening) =>
      new RegExp(`^${opening.songMatch}$`, 'i').test(match.join(' '))
    );
    if (index < 0)
      return error("I couldn't find any opening song with that name!", message);
    const song = songs[index];
    const embed = () =>
      new MessageEmbed().setColor('GREEN').setAuthor(...author(message.author));
    const sent = await message.channel.send(
      embed().setTitle(
        `Are you sure you want to delete ${song.anime} ${song.song} by ${song.author}?`
      )
    );
    await sent.react('✅');
    await sent.react('❌');
    const collected = await sent.awaitReactions(
      (reaction, user) =>
        ['✅', '❌'].includes(reaction.emoji.name) &&
        user.id === message.author.id,
      { max: 1 }
    );
    if (collected.first().emoji.name === '❌')
      return error('Deletion Canceled', message);
    songs.splice(index, 1);
    write(songs);
    require('fs').unlinkSync(`./music/${song.file}.mp3`);
    message.channel.send(embed().setTitle('Song Deleted :+1:'));
  },
};
