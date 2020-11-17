const { MessageEmbed } = require('discord.js');

module.exports = {
  match: '(score(board)?|lb|leaderboard)',
  execute(client, message) {
    message.channel.send(
      new MessageEmbed()
        .setColor('GREEN')
        .setTitle('Scoreboard')
        .setDescription(client.scoreboard.compute())
    );
  },
};
