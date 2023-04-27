const express = require("express");
const mongoose = require("mongoose");
const User = require('./models/User')
const dotenv = require("dotenv");
dotenv.config()

const connectionString = process.env.DB_CONNECTION_STRING;
const PORT = process.env.PORT;

const app = express();

mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to MongoDB"))
  .catch((err) => console.error(err));

app.use(express.json())

//GET all  the users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (err) {
    res.status(500).json({message: err.message})
  }
});

// Add a new user: POST
app.post('/users', async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  })

  try {
    const newUser = await user.save()
    res.status(201).json(newUser)
  } catch (err) {
    res.status(400).json({ message: err.message})
  }
})

// Update a user by ID: PUT
app.put('users/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {new: true})
    if (!updatedUser) throw new Error('User not found')
    res.json(updatedUser)
  } catch(err) {
    res.status(400).json({message: err.message })
  }
})

// Delete a user by ID: DELETE
app.delete('/users/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) throw new Error('User not found');
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
