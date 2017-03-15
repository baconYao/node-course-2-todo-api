// mongoose methods vs statics : http://stackoverflow.com/questions/29664499/mongoose-static-methods-vs-instance-methods

const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');      //https://jwt.io/
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
  email: {
   type: String,
    required: true,                   //一定要有值
    minlength: 1,                     //最少需要一個字
    trim: true,                       //將前後空白去除，例如： ' I love you  '  => 'I love you'
    unique: true,
    validate: {
      validator: (value) => {
        return validator.isEmail(value)
      },
      message: '{VALUE} is not a valid value'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

// mongoose內建的methods 『toJSON』， 會自動執行，將所選擇的物件JSON化，類似JSON.stringify
UserSchema.methods.toJSON = function() {
  var user = this;
  var userObject = user.toObject();
  return _.pick(userObject, ['_id', 'email']);    //只傳回_id, email給user
};

UserSchema.methods.generateAuthToken = function() {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();          //abc123 is secret value

  user.tokens.push({access,token});

  return user.save().then(() => {
    return token;
  });
};

UserSchema.methods.removeToken = function(token) {
  var user = this;

  return user.update({
    $pull: {                //mongodb $pull: https://docs.mongodb.com/manual/reference/operator/update/pull/
      tokens: {
        token: token
      }
    }
  });
};


UserSchema.statics.findByToken = function(token) {
  var User = this;
  var decode;

  try{
    decode = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e){
    // return new Promise((resolve, reject) => {
    //   reject();
    // });
    return Promise.reject();
  }

  return User.findOne({
    '_id': decode._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};


UserSchema.statics.findByCredentials = function(email, password) {
  var User = this;

  return User.findOne({email}).then((user) => {
    if(!user) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if(res) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};


// mongoose middleware, 在save之前要做的事
UserSchema.pre('save', function(next) {
  var user = this;

  if(user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});


const User = mongoose.model('User', UserSchema);

module.exports = {User};
