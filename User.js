const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://sirkinggreat:BzQlSKbhZpotSrb9@alumini.nh889q5.mongodb.net/?retryWrites=true&w=majority&appName=alumini', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const Schema = mongoose.Schema;
const userSchema = new Schema({
  name: String,
  batch: String,
  email: String,
  phone: String,
  occupation: String,
  achievements: String,
  designation: String,
  city: String,
  address: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;