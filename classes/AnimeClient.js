const { Client, Collection, MessageEmbed } = require('discord.js');
const ScoreBoard = require('./ScoreBoard');

function author(user) {
  return [user.username, user.displayAvatarURL({ dynamic: true })];
}

function error(error, message, options) {
  const embed = new MessageEmbed()
    .setColor('GREEN')
    .setAuthor(...author(message.author))
    .setTitle(`:x: ${error}`);
  if (options && options.usage)
    embed.addField('Correct Usage', `\`${options.usage}\``);
  if (options && options.description) embed.setDescription(options.description);
  return message.channel
    .send(embed)
    .then((msg) =>
      msg.delete({ timeout: options ? options.timeout || 4000 : 4000 })
    );
}

module.exports = class AnimeClient extends Client {
  constructor(ClientOptions) {
    super(ClientOptions);
    Object.assign(this, {
      commands: new Collection(),
      scoreboard: new ScoreBoard(),
      active: false,
      author,
      error,
    });
  }
};
