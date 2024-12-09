class State {
  constructor() {
    this.state = {};
  }

  set(key, value) {
    this.state[key] = value;
  }
  get(key) {
    if (!this.state[key]) {
      throw new Error(`Plugin ${key} does not specify core component`);
    }
    return this.state[key];
  }
  remove(key) {
    this.state[key] = null;
  }
}

module.exports = State;
