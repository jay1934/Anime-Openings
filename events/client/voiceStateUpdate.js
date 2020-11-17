module.exports = ({ channel }, { client, member }) => {
  if (!client.active || (channel || {}).id !== client.active.voice.id) return;

  if (
    (member.id !== client.user.id && channel.members.size === 1) ||
    member.id === client.user.id
  )
    client.active.end();
};
