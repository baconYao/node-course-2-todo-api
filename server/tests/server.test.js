const expect = require('expect');
const request = require('supertest');


const {app} = require('./../server');
const {Todo} = require('./../models/todo');

//每次測試時，都會將db清空
beforeEach((done) => {
  Todo.remove({}).then(() => done());
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
        Todo.find().then((todos) => {
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
          expect(todos.length).toBe(0);       //找不到資料
          done();
        }).catch((err) => done(err));
      });
  });
});
