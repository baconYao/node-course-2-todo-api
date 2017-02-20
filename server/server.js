const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  // console.log(req.body);
  var todo = new Todo({
    text : req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos/:id', (req, res) => {
  var id = req.params.id;
  // Valid id using isValid
  if(!ObjectID.isValid(id)) {
    // 404 - send back empty send
    return res.status(404).send();
  }

    // findById
    Todo.findById(id).then((todo) => {
      if(!todo) {
        return res.status(404).send();
      }
      res.send({todo});
    }).catch((e) => {
      res.status(400).send();
    });
});

app.delete('/todos/:id', (req, res) => {
  // get th id
  var id = req.params.id;
  // validate the id -> mot valid? return 404
  if(!ObjectID.isValid(id)) {
    // 404 - send back empty send
    return res.status(404).send();
  }
  // remove by id
  Todo.findByIdAndRemove(id).then((todo) => {
    if(!todo) {
      return res.status(404).send();
    }
    // success
    res.send({todo});
  }).catch((e) => {
    // error
    res.status(404).send();
  });
});

// 可讓使用者更新
app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  //pick是將req.body內的text，complete值給body，https://lodash.com/docs/4.17.4#pick
  var body = _.pick(req.body, ['text', 'completed']);

  if(!ObjectID.isValid(id)) {
    // 404 - send back empty send
    return res.status(404).send();
  }

  if(_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if(!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});


app.listen(port, () => {
  console.log(`Started on port ${port}`);
});


module.exports = {app};               //for mocha test
