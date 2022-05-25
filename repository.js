const fs = require('fs');

class UserRepository {
  constructor(db_path) {
    this.db_path = db_path;
    const rawdata = fs.readFileSync(db_path);

    try {
      this.users = JSON.parse(rawdata);
    } catch (e) {
      this.users = [];
    }
  }
  create(user) {
    this.users.push(user);
    this._updateFile();
  }

  list() {
    return this.users;
  }

  remove(cpf) {
    this.users = this.users.filter((user) => user.cpf !== cpf);
    this._updateFile();
  }

  update(cpf, newData) {
    this.users = this.users.filter((user) => user.cpf !== cpf);
    this.users.push(newData);
    this._updateFile();
  }

  findByCpf(cpf) {
    return this.users.find((user) => user.cpf === cpf);
  }

  removeAll() {
    this.users = [];
    this._updateFile();
  }

  _updateFile() {
    fs.writeFileSync(this.db_path, JSON.stringify(this.users));
  }
}

module.exports = {
  UserRepository,
};
