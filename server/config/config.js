var env = process.env.NODE_ENV || 'development';
console.log('env ===', env);
// 為了讓正式及測試用的DB分開
if(env === 'development') {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if(env === 'test') {                       //test是在package.json的 script test定義的
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
}
