import mongoose from 'mongoose';

// Config
import { MONGODB_URI, DB_USER, DB_PASSWORD } from '@/config';

// Models
import { User, Todo } from '@/models';

// Utils
import { redisClient } from '@/utils';

function importTest(name: string, path: string) {
  return describe(name, () => {
    require(path);
  });
}

describe('Fancy Todo API Tests', () => {
  beforeAll(async () => {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: true,
      dbName: 'fancy-todo-test',
      user: DB_USER,
      pass: DB_PASSWORD,
    });

    await User.deleteMany({});
    await Todo.deleteMany({});
  });

  importTest('User Tests', './user-tests');

  importTest('Todo Tests', './todo-tests');

  afterAll(async () => {
    await User.deleteMany({});
    await Todo.deleteMany({});

    await mongoose.connection.db.dropDatabase();

    await mongoose.connection.close();

    await redisClient.endAsync(undefined);
  });
});
