const { Collection } = require('discord.js');

module.exports = class ScoreBoard extends Collection {
  get leader() {
    const sorted = this.sort((a, b) => b - a);
    return [sorted.firstKey(), sorted.first()];
  }

  inc(key, value = 1) {
    this.set(key, (this.get(key) || 0) + value);
    return this.get(key);
  }

  compute(limit = 10) {
    let list = 1;
    let idx = 1;
    return (
      this.sort((a, b) => b - a)
        .filter(() => list++ < limit)
        .map(
          (points, user) =>
            `${idx++}. **<@${user}>** - ${points} point${idx === 1 ? '' : 's'}`
        )
        .join('\n') || "Nobody's on the scoreboard yet!"
    );
  }
};
