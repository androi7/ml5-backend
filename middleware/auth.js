const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("token");
  console.log('token:', token);

  if(!token) {
    // 401 Unauthorized
    // return res.status(401).json({
    //   message: "auth error"
    // });
    return res.redirect(307,'/login');
  }

  try {
    // decoded payload, if signature and optional parameters (expiration) are valid
    const decoded = jwt.verify(token, "myPrivateKey");
    console.log('decoded user:', decoded.user);
    req.user = decoded.user;
    next();
  } catch(e) {
    console.error(e);
    // res.status(500).send({
    //   message: "invalid token"
    // });
    res.redirect('/login');
  } // try/catch
};  // module.exports
