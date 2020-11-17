module.exports = (message, client) => {
  if (!message.guild || message.author.bot || !message.content.startsWith('.'))
    return;
  const args = message.content.slice(1).split(/ +/);
  const name = args.shift();
  const command = message.client.commands.find(({ match }) =>
    new RegExp(`^${match}$`).test(name)
  );

  if (!command) return;

  try {
    command.execute(client, message, args);
  } catch (e) {
    message.channel.send(`:x: Something went wrong`);
    console.log(e);
  }
};
