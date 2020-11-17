const Quiz = require('../classes/Quiz');

module.exports = {
  match: '(play|start)',
  async execute({ active, error }, message, [goal]) {
    if (active)
      return error(
        `There's already a game being played in ${active.voice.name}!`,
        message
      );
    if (!message.member.voice.channel)
      return error('You must be in a voice channel to play!', message);

    if (goal && Number.isNaN(goal))
      error(`${goal} is not a number!`, message, {
        usage: '.play [goal]',
      });

    if (goal && (+goal > 50 || +goal < 1))
      error('Your goal must be over 0 and under 51!', message);

    new Quiz({
      freeplay: false,
      leader: message.author,
      text: message.channel,
      client: message.client,
      connection: await message.member.voice.channel.join(),
      goal: +goal,
    }).start();
  },
};
