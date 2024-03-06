import { PassportStatic } from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserModel } from "../model/user.model";

var opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.CHATIFY_DEMO_JWT_SECRET,
};
export const jwtStrategy = (passport: PassportStatic) => {
  passport.use(
    new Strategy(opts, async (jwt_payload, done) => {
      let foundUser = await UserModel.findById(jwt_payload._id);
      if (!foundUser) return done(null, false);
      else return done(null, foundUser);
    })
  );
};
