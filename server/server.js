require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const cool = require('cool-ascii-faces')
const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');
const _ = require('lodash');
const app = express();

const post = process.env.PORT;
app.use(bodyParser.json());
app.get('/cool', (req, res) => res.send(cool()))
app.post('/todos', (req, res) => {
  const todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});
app.get('/', (req, res) => {
  res.send('hello world! My name is Phan');
});
app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({ todos });
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos/:id', (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findById(id).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({ todo });
  }).catch((e) => {
    res.status(400).send();
  });
});

app.delete('/todos/:id', (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  Todo.findByIdAndRemove(id).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({ todo });
  }).catch((e) => {
    res.status(400).send();
  });
})

app.patch('/todos/:id', (req, res) => {
  const id = req.params.id;
  const body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(400).send();
  }
  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }
  Todo.findOneAndUpdate({ _id: id }, { $set: body }, { new: true, useFindAndModify: false })
    .then((todo) => {
      if (!todo) {
        return res.status(400).send();
      }
      res.send({ todo })
    }).catch((e) => {
      return res.status(400).send();
    })
})



app.post('/users', async (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);
  const user = new User(body);
  try {
    let resUser = await user.save();
    let token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (error) {
    console.log(error)
    res.status(400).send(error);
  }
})



app.listen(post, () => {
  console.log(`Started on port ${post}`);
});

module.exports = { app };
