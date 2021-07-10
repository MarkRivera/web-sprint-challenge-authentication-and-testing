const jwt = require("jsonwebtoken");
const secrets = require("../config/secrets");

module.exports = (req, res, next) => {
  const [authType, token] = req.headers.authorization.split(" ");
  const secret = secrets.jwtSecret;

  if (token) {
    jwt.verify(token, secret, (err, decodedToken) => {
      if (err) {
        console.error(err);
        res.status(400).json({ msg: "Invalid token!" });
      } else {
        req.decodedToken = decodedToken;
        next();
      }
    });
  } else {
    res.status(400).json({ msg: "Token is missing" });
  }
};
