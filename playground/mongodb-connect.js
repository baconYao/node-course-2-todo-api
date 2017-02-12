// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// var user = {
//   name: 'YaoYaoYao',
//   age: 22
// };
// var {name} = user;       //print out user obj's name property
// console.log(name);




// connect to 『TodoApp』 database
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: false
  // }, (err, result) => {
  //   if(err) {
  //     return console.log('Unable to insert todo.');
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });


  // db.collection('Users').insertOne({
  //   name: 'BaconYao Chang',
  //   age: 20,
  //   location: 'Taiwan'
  // },(err, result) => {
  //   if(err) {
  //     return console.log('Unable to insert user.');
  //   }
  //   console.log(result.ops[0]._id.getTimestamp());  
  // });




  // close connection
  db.close();
});
