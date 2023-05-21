// simple express server
const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => res.send("Hello from bff-service!"));

app.listen(port, () => console.log(`bff-service listening on port ${port}!`));

// // verify a jwt
// const jwtStrategy = passportJWT.Strategy;
// const extractJWT = passportJWT.ExtractJwt;
// const jwtOptions = {
//   jwtFromRequest: extractJWT.fromAuthHeaderAsBearerToken(),
//   secretOrKey: "secret",
// };
// passport.use(
//   new jwtStrategy(jwtOptions, async (jwtPayload, done) => {
//     return done(null, jwtPayload);
//   })
// );

// // check if a user is authenticated
// app.get(
//   "/users/authenticated",
//   passport.authenticate("jwt", { session: false }),
//   (req, res) => {
//     res.send(req.user);
//   }
// );
