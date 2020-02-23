const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("token");

  if(!token) {
    // 401 Unauthorized
    return res.status(401).json({
      message: "auth error"
    });
  }

  try {
    const decoded = jwt.verify(token, "myPrivateKey");
    req.user = decoded.user;
    next();
  } catch(e) {
    console.error(e);
    res.status(500).send({
      message: "invalid token"
    });
  } // try/catch
};  // module.exports
