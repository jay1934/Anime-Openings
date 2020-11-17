const { MessageEmbed } = require('discord.js');
const ScoreBoard = require('./ScoreBoard');
const StreakCollection = require('./StreakCollection');

const getSong = () => require('../data/openings.json')[~~(Math.random() * 175)];
const getDetails = (song) => `${song.anime} ${song.song} by ${song.author}`;
const update = (message, quiz) => {
  const { current } = quiz;
  if (/has a streak of \d+ 🔥/.test(message.embeds[0].footer.text)) return;
  const interval = setInterval(
    () =>
      message.edit({
        embed: {
          ...message.embeds[0],
          footer: {
            text: message.embeds[0].footer.text.replace(/\d+/, (match) => {
              if (+match <= 2 || current.song !== quiz.current.song)
                clearInterval(interval);
              return `${
                current.song === quiz.current.song || +match > 2
                  ? +match - 2
                  : 0
              }`;
            }),
          },
        },
      }),
    2000
  );
};

module.exports = class Quiz {
  /**
   * Quiz Options
   * @param {object} options
   * @property {boolean} freeplay
   * @property {object} leader
   * @property {object} text
   * @property {object} client
   * @property {object} connection
   * @property {goal} goal
   */
  constructor(options) {
    Object.assign(this, {
      ...options,
      scoreboard: new ScoreBoard(),
      streaks: new StreakCollection(),
      voice: options.connection.channel,
    });
    options.client.active = this;
  }

  newFreeplaySong(song) {
    this.text
      .send(
        new MessageEmbed()
          .setColor('GREEN')
          .setAuthor(...this.client.author(this.leader))
          .setTitle(`Now playing ${song.anime} ${song.song} by ${song.author}`)
          .setFooter(`There is about ${song.duration} seconds remaining`)
      )
      .then((msg) => update(msg, this));
    this.connection.dispatcher.once('finish', () =>
      this.newFreeplaySong(this.play())
    );
  }

  start() {
    this.text
      .send(
        new MessageEmbed()
          .setAuthor(...this.client.author(this.leader))
          .setColor('GREEN')
          .setAuthor(
            `A new game has started in #${this.text.name} in ${this.voice.name}`
          )
          .setFooter(
            `You have 30 seconds to guess the next song or anime title!${
              this.goal ? ` • Playing to ${this.goal} points` : ''
            }`
          )
      )
      .then((msg) => update(msg, this));
    this.play();
  }

  play() {
    const song = getSong();
    console.log(song.animeMatch, song.songMatch);
    this.current = song;
    this.connection.play(
      require('path').join(__dirname, `../music/${song.file}.mp3`),
      {
        seek: this.freeplay ? 0 : ~~(Math.random() * (song.duration - 30)),
        volume: false,
      }
    );
    return this.freeplay ? song : this.listen(song);
  }

  async listen(song) {
    this.text
      .awaitMessages(
        (message) =>
          this.voice.members.has(message.author.id) &&
          (new RegExp(`^${song.songMatch}$`, 'i').test(message.content) ||
            new RegExp(`^${song.animeMatch}$`, 'i').test(message.content)),
        {
          max: 1,
          time: 30000,
          errors: ['time'],
        }
      )
      .then((collected) => {
        if (this.current.song !== song.song || !this.client.active) return;

        const message = collected.first();
        const global = this.client.scoreboard.inc(message.author.id);
        const reward = Object.entries(
          require('../config.json').roleRewards
        ).find(([required]) => +required === global);

        if (reward) {
          const role = this.text.guild.roles.cache.get(reward[1]);
          this.text.send(
            new MessageEmbed()
              .setColor('GREEN')
              .setAuthor(...this.client.author(message.author))
              .setTitle(
                `:tada: ${message.author.tag}, you've won ${reward[0]} games, and have achieved the \`${role.name}\` role :tada:`
              )
          );
          message.member.roles.add(role);
        }
        if (this.scoreboard.inc(message.author.id) === this.goal)
          return this.end();
        const [id, points] = this.streaks.addStreak(message.author.id).leader;
        message.channel
          .send(
            new MessageEmbed()
              .setColor('GREEN')
              .setAuthor(...this.client.author(message.author))
              .setTitle(`That was ${getDetails(song)}`)
              .setDescription(`${message.author} guessed correctly!`)
              .addField('Scoreboard', this.scoreboard.compute())
              .setFooter(
                `${
                  points > 2
                    ? `${
                        this.client.users.cache.get(id).tag
                      } has a streak of ${points} 🔥`
                    : `You have 30 seconds to guess the next song or anime title!`
                }${this.goal ? ` • Playing to ${this.goal} points` : ''}`
              )
          )
          .then((msg) => update(msg, this));
        this.play();
      })
      .catch(() => {
        this.streaks.removeAll();
        if (this.current.song !== song.song || !this.client.active) return;
        this.text
          .send(
            new MessageEmbed()
              .setColor('RED')
              .setTitle(`That was ${getDetails(song)}`)
              .setDescription('Nobody got it!')
              .addField('Scoreboard', this.scoreboard.compute())
              .setFooter(
                `You have 30 seconds to guess the next song or anime title!${
                  this.goal ? ` • Playing to ${this.goal} points` : ''
                }`
              )
          )
          .then((msg) => update(msg, this));
        this.play();
      });
  }

  end() {
    this.client.active = false;
    const leader = this.client.users.cache.get(this.scoreboard.leader[0]);
    const embed = new MessageEmbed().setColor('GREEN');
    if (!this.freeplay)
      embed
        .setTitle(leader ? `:tada: ${leader.tag} won :tada:` : `Nobody won!`)
        .addField('Scoreboard', this.scoreboard.compute());
    else embed.setTitle('Session Concluded');
    if (leader && !this.freeplay)
      embed.setThumbnail(leader.displayAvatarURL({ dynamic: true }));
    this.text.send(embed);
    if (this.voice.members.has(this.client.user.id)) this.voice.leave();
  }
};
