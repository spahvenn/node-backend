import mongoose from 'mongoose';
import findOrCreate from 'mongoose-findorcreate';
import bcrypt from 'bcrypt-nodejs';

const UserSchema = mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: {type: String, required: true },
  googleId: String,
  createDate: { type: Date, default: Date.now },
});

UserSchema.plugin(findOrCreate);

UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

var User = mongoose.model('User', UserSchema);

export default User;