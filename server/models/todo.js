var mongoose = require('mongoose');

// 定義一個名為「Todo」的model內的schema
const Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,                   //一定要有值
    minlength: 1,                     //最少需要一個字
    trim: true                        //將前後空白去除，例如： ' I love you  '  => 'I love you'
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  },
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

module.exports = {Todo};
