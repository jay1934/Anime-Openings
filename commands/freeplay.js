const { MessageEmbed } = require('discord.js');
const Quiz = require('../classes/Quiz');

module.exports = {
  match: 'freeplay',
  async execute({ active, author, error }, message) {
    if (active)
      return error(
        `There's already a game being played in ${active.voice.name}!`,
        message
      );

    if (!message.member.voice.channel)
      return error('You must be in a voice channel to play!', message);

    const quiz = new Quiz({
      freeplay: true,
      leader: message.author,
      text: message.channel,
      client: message.client,
      connection: await message.member.voice.channel.join(),
    });

    message.channel.send(
      new MessageEmbed()
        .setColor('GREEN')
        .setAuthor(...author(message.author))
        .setTitle('Freeplay Initiated')
    );

    quiz.newFreeplaySong(quiz.play());
  },
};
