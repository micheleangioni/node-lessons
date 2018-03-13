module.exports = (app) => {
  const mongoose = app.get('mongooseClient');
  const { Schema } = mongoose;

  const users = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, unique: true },
    password: { type: String, required: true }
  });

  return mongoose.model('users', users);
};
