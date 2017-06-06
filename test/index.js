let request = require('supertest')
import secret from '../secret/secret'
import jwt from 'jsonwebtoken'
import chai from 'chai'

chai.should();

request = request('http://localhost:3001')

function getJwt() {
  return request
    .post('/login')
    .send(
      {
        email: secret.admin.email,
        password: secret.admin.password
      }
    )
    .expect(200)
}

function getUserIdFromToken(token) {
  var decoded = jwt.verify(token, secret.jwtSecret);
  return decoded.user.id;
}

describe('GET /user', function() {
  it('deny access without token', function(done) {
    request.get('/user/1')
      .expect(401, done);
  });
});

describe('POST /login', function() {
  it('Ask for access token', function(done) {
      getJwt()
      .then(res => {
        jwt.verify(res.body.token, secret.jwtSecret, (err, decoded) => {
          const email = decoded.user.email
          email.should.equal(secret.admin.email)
          done();
        })
      })
  });
});

describe('User tests', function() {
  it('GET user', function(done) {
    getJwt()
      .then(res => {
        const userId = getUserIdFromToken(res.body.token)
        request
          .get('/user/'+userId)
          .set('Authorization', 'Bearer '+res.body.token)
          .expect(200)
          .then(res => {
            const email = res.body.user.email;
            email.should.equal(secret.admin.email)
            done()
          })
      })
  })

  it('GET non-existent user', function(done) {
    getJwt()
      .then(res => {
        request
          .get('/user/1')
          .set('Authorization', 'Bearer '+res.body.token)
          .expect(404)
          .then(res => {
            done()
          })
      })
  })
})

