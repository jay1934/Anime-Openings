const { MessageEmbed } = require('discord.js');

module.exports = {
  match: 'f(orce)?s(kip)?',
  execute({ active, author, error }, message) {
    if (!active) return error("There's no game being played!", message);
    if (active.text.id !== message.channel.id)
      return error(
        'Please use quiz commands in the channel the quiz is being played in!',
        message
      );
    if (active.leader.id !== message.author.id)
      return error(
        `Only ${active.leader.tag} can end this force skip!`,
        message
      );

    message.channel.send(
      new MessageEmbed()
        .setAuthor(...author(message.author))
        .setColor('GREEN')
        .setTitle('Song Skipped')
        .setDescription(
          `That was ${active.current.anime} ${active.current.song} by ${active.current.author}`
        )
    );

    const song = active.play();
    if (active.freeplay) active.newFreeplaySong(song);
  },
};
