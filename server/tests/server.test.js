const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

//資料集，會在17行被加入DB 
const todos = [{
  text: 'First test todo'
}, {
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
        expect(res.body.todos.length).toBe(2);     //會取得6~12行存取的那兩筆data
      })
      .end(done);
  });
});









