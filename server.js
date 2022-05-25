const { start } = require('./app');
const { UserRepository } = require('./repository');
const port = 3000;

const userRepository = new UserRepository('db.json');

const app = start(userRepository);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
