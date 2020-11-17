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
        new MessageEmbed().setColor('GREEN').setTitle('Song Skipped')
      );
      const song = active.play();
      if (active.freeplay) active.newFreeplaySong(song);
      active.skip = true;
      return;
    }
    message.channel
      .send(
        new MessageEmbed()
          .setColor('GREEN')
          .setTitle(
            `Would you like to skip this song? (${required} votes needed)`
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

        active.connection.dispatcher.once('start', () => {
          msg.delete();
          collector.end('natural');
        });

        collector.on('collect', () => {
          msg
            .edit({
              embed: {
                ...msg.embeds[0],
                title: msg.embeds[0].title.replace(
                  `${required}`,
                  `${--required}`
                ),
              },
            })
            .on('end', (_, reason) => {
              if (reason === 'natural') return;
              msg.edit(
                new MessageEmbed().setColor('GREEN').setTitle('Song Skipped')
              );
              const song = active.play();
              if (active.freeplay) active.newFreeplaySong(song);
              active.skip = true;
            });
        });
      });
  },
};
