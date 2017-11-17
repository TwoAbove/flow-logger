class Logger {
  constructor() {
    this.logged = {};
  }
  timed(what, comment) {
    this.logged[what] = {};
    this.logged[what].comment = comment;
    this.logged[what].startedAt = Date.now();
    this.logged[what].end = () => {
      this.logged[what].endedAt = Date.now();
      this.logged[what].duration = +this.logged[what].endedAt - this.logged[what].startedAt;
    }
  }
};

Logger.prototype.toString = function () {
  return JSON.stringify(this.logged);
};

module.exports = Logger;
