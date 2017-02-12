// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// connect to 『TodoApp』 database
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // db.collection('Todos').findOneAndUpdate({
  //   _id : new ObjectID("58a0456a6bce4395c3e63ae4")
  // }, {
  //   // https://docs.mongodb.com/manual/reference/operator/update/
  //   // http://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html#findOneAndUpdate
  //   $set : {
  //     completed: true
  //   }
  // }, {
  //   returnOriginal: false
  // }).then((result) => {
  //   console.log(result);
  // });

  db.collection('Users').findOneAndUpdate({
    _id : new ObjectID("589f3f8ca5f56f1173751cfa")
  }, {
    $set: {
      name: 'YaoYao'
    },
    $inc: {
      age: 1
    }
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log(result);
  });


  // close connection
  db.close();
});
