var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new mongoose.Schema({
  name: String,
  password: String,
  email: String
});

UserSchema.methods.toJSON = function(){
  var user = this.toObject();
  delete user.password;
  return user;
}

UserSchema.methods.comparePasswords = function(passwrd, callback){
    bcrypt.compare(passwrd,this.password,callback);
};

UserSchema.pre('save', function(next) {
  var user = this;
  console.log('pre save event');

  if (!user.isModified('password')) return next();
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);
    console.log('pre save event hash');
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

module.exports = mongoose.model('User', UserSchema);
