const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');      //https://jwt.io/
const _ = require('lodash');

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
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();          //abc123 is secret value

  user.tokens.push({access,token});

  return user.save().then(() => {
    return token;
  });
};


const User = mongoose.model('User', UserSchema);

module.exports = {User};
