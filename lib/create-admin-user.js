import User from './models/user';
import secret from '../secret/secret.json';

export default function createAdminUser() {

  const UserModel = new User()
  const email = secret.admin.email
  const password = secret.admin.password

  User.findOne({'email': email}, function(err, user) {
    if (err) {
      console.log('error while finding a user')
      return
    }
    if (!user) {
      const newUser = new User({
        email: email,
        password: UserModel.generateHash(password),
      });
      newUser.save((err, newUser) => {
        if (err) {
          console.log('error while creating a new user')
        }
      })
    }
  })
}

