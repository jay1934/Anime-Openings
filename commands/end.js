module.exports = {
  match: '(end|stop|finish)',
  execute({ active, error }, message) {
    if (!active) return error("There's no game being played!", message);
    if (active.text.id !== message.channel.id)
      return error(
        'Please use quiz commands in the channel the quiz is being played in!',
        message
      );
    if (active.leader.id !== message.author.id)
      return error(`Only ${active.leader.tag} can end this game!`, message, {
        description:
          'If you all leave the voice channel or kick me from the voice channel, the game will forcibly end.',
      });

    active.end();
  },
};
