import passport from "passport";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { GraphQLLocalStrategy } from "graphql-passport";

export const configurePassport = async () => {
    passport.serializeUser((user, done) => {

        // Check if user is a Promise and resolve if necessary
        if (user instanceof Promise) {
            user.then(resolvedUser => {
                done(null, resolvedUser._id);
            }).catch(err => {
                done(err);
            });
        } else {
            done(null, user._id);
        }
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });

    passport.use(
        new GraphQLLocalStrategy(async (username, password, done) => {
            try {
                const user = await User.findOne({ username });
                if (!user) {
					throw new Error("Invalid username or password")
                }
				
                const validPassword = await bcrypt.compare(password, user.password);
                if (!validPassword) {
					throw new Error("Invalid username or password")
                }

                // console.log("Authenticated user:", user);
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        })
    );
};
