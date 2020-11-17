const ScoreBoard = require('./ScoreBoard.js');

module.exports = class StreakCollection extends ScoreBoard {
  addStreak(user) {
    if (!this.has(user)) this.set(user, 0);
    this.filter((_, curr) => curr !== user).forEach((points, user) =>
      this.inc(user, -points)
    );
    this.inc(user);
    return this;
  }

  removeAll() {
    this.forEach((points, user) => this.inc(user, -points));
  }
};
