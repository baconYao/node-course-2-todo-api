const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

//�Y�ϼ�������17�б�����DB 
const todos = [{
  _id: new ObjectID(),
  text: 'First test todo'
}, {
  _id: new ObjectID(),
  text: 'Second test todo'
}];

//ÿ�Μyԇ�r��������db���
beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')                           //post ����url
      .send({text})                             //���͵ă��ݞ�text
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
          expect(todos.length).toBe(1);         //db�ȣ�todos collection�ȵ��Y����
          expect(todos[0].text).toBe(text);
          done();
        }).catch((err) => done(err));
      });
  });

  // ���Y�ϲ�����Ҏ���r���K���������Y�ϵ��Y�ώ�
  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .send({})                               //�Ͳ�����Ҏ�����Y��
      .expect(400)
      .end((err) => {
        if(err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);       //����7~12�������ăɹP�⣬�Ҳ����������Y��
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
        // console.log(res.body);                        //��DB�ҵ���һ�P�Y��
        expect(res.body.todos.length).toBe(2);     //��ȡ��6~12�д�ȡ���ǃɹPdata
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
        // console.log(res.body);                        //��DB�ҵ���һ�P�Y��
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


describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    var hexId = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }

        Todo.findById(hexId).then((todo) => {
          expect(todo).toNotExist();
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return 404 if todo not found', (done) => {
    var hexId = new ObjectID().toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 if object id is invalid', (done) => {
    request(app)
      .delete('/todos/123abc')
      .expect(404)
      .end(done);
  });
});






