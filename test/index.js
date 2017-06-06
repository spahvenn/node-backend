let request = require('supertest')
import secret from '../secret/secret'
import jwt from 'jsonwebtoken'
import chai from 'chai'

chai.should();

request = request('http://localhost:3001')

describe('GET /user', function() {
  it('deny access without token', function(done) {
    request.get('/user/1')
      .expect(401, done);
  });
});

describe('POST /login', function() {
  it('Ask for access token', function(done) {
    request
      .post('/login')
      .send(
        {
          email: secret.admin.email,
          password: secret.admin.password
        }
      )
      .expect(200)
      .then(res => {
        jwt.verify(res.body.token, secret.jwtSecret, (err, decoded) => {
          const email = decoded.user.email
          email.should.equal(secret.admin.email)
          done();
        })
      })
  });
});