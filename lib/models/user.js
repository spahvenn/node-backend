import mongoose from 'mongoose';
import findOrCreate from 'mongoose-findorcreate';

const UserSchema = mongoose.Schema({
  name: String,
  email: String,
  googleId: String,
  createDate: { type: Date, default: Date.now },
});

UserSchema.plugin(findOrCreate);

var User = mongoose.model('User', UserSchema);

export default User;