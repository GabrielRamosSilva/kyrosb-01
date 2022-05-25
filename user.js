class User {
  constructor(name, email, cpf, birthdate, phoneNumber) {
    this.name = name;
    this.email = email;
    this.cpf = cpf;
    this.birthdate = birthdate;
    this.phoneNumber = phoneNumber;
  }
}

module.exports = {
  User,
};
