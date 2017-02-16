var mongoose = require('mongoose');

const User = mongoose.model('User', {
  email: {
    type: String,
    required: true,                   //一定要有值
    minlength: 1,                     //最少需要一個字
    trim: true                        //將前後空白去除，例如： ' I love you  '  => 'I love you'
  }
});

module.exports = {User};
