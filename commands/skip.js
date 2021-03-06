const { MessageEmbed } = require('discord.js');

module.exports = {
  match: '(skip|next)',
  execute({ active, error }, message) {
    if (!active) return error("There's no game being played!", message);
    if (active.text.id !== message.channel.id)
      return error(
        'Please use quiz commands in the channel the quiz is being played in!',
        message
      );

    let required = Math.ceil(active.voice.members.size / 2) - 1;
    if (!required) {
      message.channel.send(
        new MessageEmbed()
          .setColor('GREEN')
          .setTitle('Song Skipped')
          .setDescription(
            `That was ${active.current.anime} ${active.current.song} by ${active.current.author}`
          )
      );
      const song = active.play();
      if (active.freeplay) active.newFreeplaySong(song);
      return;
    }
    message.channel
      .send(
        new MessageEmbed()
          .setColor('GREEN')
          .setTitle(
            `Would you like to skip this song? (1/${required} votes collected)`
          )
          .setFooter(
            `This message will be deleted if time runs out${
              active.freeplay ? '' : ' or time runs out'
            }`
          )
      )
      .then(async (msg) => {
        await msg.react('✅');
        const collector = msg.createReactionCollector(
          (reaction, user) =>
            reaction.emoji.name === '✅' && active.voice.members.has(user.id),
          {
            max: required,
          }
        );

        active.connection.dispatcher.on('close', () =>
          collector.stop('natural')
        );

        collector
          .on('collect', () => {
            msg.edit({
              embed: {
                ...msg.embeds[0],
                title: msg.embeds[0].title.replace(
                  `${required}`,
                  `${--required}`
                ),
              },
            });
          })
          .on('end', (_, reason) => {
            if (reason === 'natural') return msg.delete();
            msg.edit(
              new MessageEmbed().setColor('GREEN').setTitle('Song Skipped')
            );
            const song = active.play();
            if (active.freeplay) active.newFreeplaySong(song);
          });
      });
  },
};
