const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove
// 刪掉全部
// Todo.remove({}).then((result) => {
//   console.log(result);
// });


// Todo.findOneAndRemove({_id : '58aa61658035a057d08ec532'}).then((todo) => {

// });


Todo.findByIdAndRemove('58aa61658035a057d08ec532').then((todo) => {
  console.log(todo);
});
