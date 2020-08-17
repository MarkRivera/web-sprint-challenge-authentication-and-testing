const router = require("express").Router();
const bcrypt = require("bcryptjs");
const db = require("../database/dbConfig");
const secrets = require("../config/secrets");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  // implement registration
  const { username, password } = req.body;
  const user = await db("users").where({ username }).first();

  if (user) {
    res.status(400).json({ msg: "That username already exists" });
  } else {
    const hash = await bcrypt.hash(password, 14);
    req.body.password = hash;
    const userId = await db("users").insert(req.body);
    const newUser = await db("users").where({ id: userId[0] }).first();
    res.status(201).json(newUser);
  }
});

router.post("/login", async (req, res) => {
  // implement login
  try {
    const credentials = req.body;
    const user = await db("users")
      .where({ username: credentials.username })
      .first();

    const validPassword = await bcrypt.compare(
      credentials.password,
      user.password
    );

    if (user && validPassword) {
      const token = generateToken(user);

      res.status(200).json({ msg: "Logged in!", token });
    } else {
      res.status(400).json({ msg: "Invalid Credentials!" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Something went wrong!" });
  }
});

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };

  const options = {
    expiresIn: "45s",
  };

  return jwt.sign(payload, secrets.jwtSecret, options);
}

module.exports = router;
