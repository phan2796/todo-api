var env = process.env.NODE_ENV || 'development';
console.log(env)
if (env === 'development') {
  console.log("development!!!")
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if (env.trim() === 'test') {
  console.log("test!!!")
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
} else {
  console.log("not equal!")
}
