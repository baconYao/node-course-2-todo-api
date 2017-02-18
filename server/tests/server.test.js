const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

//資料集，會在17行被加入DB 
const todos = [{
  _id: new ObjectID(),
  text: 'First test todo'
}, {
  _id: new ObjectID(),
  text: 'Second test todo'
}];

//每次測試時，都會將db清空
beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')                           //post 到此url
      .send({text})                             //傳送的內容為text
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }

        // find data from db
        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);         //db內，todos collection內的資料量
          expect(todos[0].text).toBe(text);
          done();
        }).catch((err) => done(err));
      });
  });

  // 當資料不符合規定時，並不會新增資料到資料庫
  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .send({})                               //送不符合規定的資料
      .expect(400)
      .end((err) => {
        if(err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);       //除了7~12行新增的兩筆外，找不到其他的資料
          done();
        }).catch((err) => done(err));
      });
  });
});


describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        // console.log(res.body);                        //從DB找到的一筆資料
        expect(res.body.todos.length).toBe(2);     //會取得6~12行存取的那兩筆data
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        // console.log(res.body);                        //從DB找到的一筆資料
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    var hexId = new ObjectID().toHexString();

    request(app)
      .get(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    request(app)
      .get('/todos/123abc')
      .expect(404)
      .end(done);
  });
});







