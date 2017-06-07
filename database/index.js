// Load mongoose package
var mongoose = require('mongoose');
// Connect to MongoDB and create/use database called todoAppTest
mongoose.connect('mongodb://ds111622.mlab.com:11622/api-tree');
// Create a schema
var TodoSchema = new mongoose.Schema({
  name: String,
  note: Int,
});
// Create a model based on the schema
var Todo = mongoose.model('Todo', TodoSchema);
// smargaux:Tk8AFNd8LnH5@

// Create a todo in memory
var todo = new Todo({name: 'Master NodeJS', completed: false, note: 'Getting there...'});
// Save it to database
todo.save(function(err){
  if(err)
    console.log(err);
  else
    console.log(todo);
});