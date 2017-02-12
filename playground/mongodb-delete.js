// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// connect to 『TodoApp』 database
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // deleteMany
  // db.collection('Todos').deleteMany({text: 'Eat launch'}).then((result) => {
  //   console.log(result);
  // });

  // deleteOne
  // db.collection('Todos').deleteOne({text: 'Eat launch'}).then((result) => {
  //   console.log(result);  
  // });

  // findOneAndDelete
  // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
  //   console.log(result);
  // });

  // db.collection('Users').deleteMany({name: 'Judy'});

  // db.collection('Users').findOneAndDelete({
  //   _id: new ObjectID('589f3e18cafaa3111b726bf3')
  // }).then((result) => {
  //   console.log(JSON.stringify(result, undefined, 2));
  // });

  // close connection
  db.close();
});
