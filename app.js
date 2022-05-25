const express = require('express');
const res = require('express/lib/response');
const { User } = require('./user');

const app = express();
app.use(express.json());

const start = (repository) => {
  app.post('/users', (req, res) => {
    const data = req.body;

    if (!data.name || !data.email || !data.cpf) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const newUser = new User(data.name, data.email, data.cpf, data.birthdate, data.phoneNumber);

    repository.create(newUser);

    res.status(201).send();
  });

  app.get('/users', (req, res) => {
    const users = repository.list();

    res.json(users).status(200);
  });

  app.delete('/users/:cpf', (req, res) => {
    const { cpf } = req.params;

    const userExists = repository.findByCpf(cpf);
    if (userExists) {
      repository.remove(cpf);
      return res.send();
    }
    return res.status(400).json({ error: 'User not found' });
  });

  app.put('/users/:cpf', (req, res) => {
    
    const data = req.body;
    const { cpf } = req.params;

    if (!data.name || !data.email || !data.cpf || !data.birthdate || !data.phoneNumber) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const newUser = new User(data.name, data.email, data.cpf, data.birthdate, data.phoneNumber);

    const userExists = repository.findByCpf(cpf);
    if (userExists) {
      repository.update(cpf, newUser);
      return res.send();
    }

    res.status(400).send();
    
  })

  return app;
};

module.exports = {
  start,
};
