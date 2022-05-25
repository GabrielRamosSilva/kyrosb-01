const request = require('supertest');
const { start } = require('./app');
const { UserRepository } = require('./repository');

const userRepository = new UserRepository('db_test.json');

describe('Server', () => {
  let app;

  beforeEach(() => {
    app = start(userRepository);
    userRepository.removeAll();
  });

  describe('POST /users', () => {
    it('should create a new user', async () => {
      const res = await request(app).post('/users').send({
        name: 'test',
        email: 'test@test.com',
        cpf: '12345678901',
        birthdate: '01/01/2000',
        phoneNumber: '99999999',
      });

      expect(res.status).toBe(201);
    });

    it('should not create a new user with invalid name', async () => {
      const res = await request(app).post('/users').send({
        name: '',
        email: 'test@test.com',
        cpf: '12345678901',
        birthdate: '01/01/2000',
        phoneNumber: '99999999',
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation failed');
    });

    it('should not create a new user with invalid email', async () => {
      const res = await request(app).post('/users').send({
        name: 'test',
        email: '',
        cpf: '12345678901',
        birthdate: '01/01/2000',
        phoneNumber: '99999999',
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation failed');
    });

    it('should not create a new user with invalid cpf', async () => {
      const res = await request(app).post('/users').send({
        name: 'test',
        email: 'test@test.com',
        cpf: '',
        birthdate: '01/01/2000',
        phoneNumber: '99999999',
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation failed');
    });
  });

  describe('DELETE /users/:cpf', () => {
    it('should delete a user', async () => {
      await request(app).post('/users').send({
        name: 'test',
        email: 'test@test.com',
        cpf: '12345678901',
        birthdate: '01/01/2000',
        phoneNumber: '99999999',
      });

      const res = await request(app).delete('/users/12345678901');

      expect(res.status).toBe(200);
    });

    it('should return 400 when user not exist', async () => {
      await request(app).post('/users').send({
        name: 'test',
        email: 'test@test.com',
        cpf: '12345678901',
        birthdate: '01/01/2000',
        phoneNumber: '99999999',
      });

      const res = await request(app).delete('/users/wrongUser');

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('User not found');
    });
  });

  describe('GET /users', () => {
    it('should list a user', async () => {
      await request(app).post('/users').send({
        name: 'test',
        email: 'test@test.com',
        cpf: '12345678901',
        birthdate: '01/01/2000',
        phoneNumber: '99999999',
      });

      await request(app).post('/users').send({
        name: 'test2',
        email: 'test2@test.com',
        cpf: '12345678902',
        birthdate: '01/01/2000',
        phoneNumber: '99999999',
      });

      const res = await request(app).get('/users');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);

      const user = res.body[0];

      expect(user.name).toBe('test');
      expect(user.email).toBe('test@test.com');
      expect(user.cpf).toBe('12345678901');
      expect(user.birthdate).toBe('01/01/2000');
      expect(user.phoneNumber).toBe('99999999');
    });
  });

  describe('PUT /users', () => {
    it('should update an user', async () => {
      await request(app).post('/users').send({
        name: 'test',
        email: 'test@test.com',
        cpf: '12345678901',
        birthdate: '01/01/2000',
        phoneNumber: '99999999',
      });

      await request(app).put('/users/12345678901').send({
        name: 'test2',
        email: 'test2@test.com',
        cpf: '12345678901',
        birthdate: '01/01/2000',
        phoneNumber: '99999999',        
      })

      const res = await request(app).get('/users');

      expect(res.status).toBe(200);

      const user = res.body[0];

      expect(user.name).toBe('test2');
      expect(user.email).toBe('test2@test.com');
      expect(user.cpf).toBe('12345678901');
      expect(user.birthdate).toBe('01/01/2000');
      expect(user.phoneNumber).toBe('99999999');
    });

    it('should update an user', async () => {
      await request(app).post('/users').send({
        name: 'test',
        email: 'test@test.com',
        cpf: '12345678901',
        birthdate: '01/01/2000',
        phoneNumber: '99999999',
      });

      const res = await request(app).put('/users/12345678').send({
        name: 'test2',
        email: 'test2@test.com',
        cpf: '12345678901',
        birthdate: '01/01/2000',
        phoneNumber: '99999999',
      })

      expect(res.status).toBe(400);
    });    
  });  
});
