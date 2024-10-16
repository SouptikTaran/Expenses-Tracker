import User from "../../models/user.model.js";
import bcrypt from "bcryptjs"

const userResolver = {
    Query: {
        authUser: async (_,__,context) => {
            try {
                const user = await context.getUser();
                return user;
            } catch (error) {
                console.error("Error in authUser: " , error);
                throw new Error(error.message || "Internal Server Error")
            }
        },
        user: async(_, { userId }) => {
            try {
                const user = await User.findById(userId);    
            } catch (error) {
                console.error("Error in user query: " , error);
                throw new Error(error.message || "Internal Server Error")
            }
        }
    },
    Mutation: {
        signUp: async (_, { input }, context) => {
            try {
                const { username, name, password, gender } = input
                if (!username || !name || !password || !gender) {
                    throw new Error("All Fileds Required");
                }
                const existing = await User.findOne({ username });
                if (existing) throw new Error("User already Exists")

                const salt = await bcrypt.genSalt(10)
                const hashedpassword = await bcrypt.hash(password, salt);
                let profilePicture;
                if (gender == "male") {
                    profilePicture = `https://avatar.iran.liara.run/public/boy?username=${name}`;
                } else {
                    profilePicture = `https://avatar.iran.liara.run/public/girl?username=${name}`
                }

                const newUser = User.create({
                    username,
                    name,
                    password: hashedpassword,
                    gender,
                    profilePicture
                })
                await context.login(newUser);
                return newUser
            } catch (error) {
                console.error("Error in signup: ", error);
                throw new Error(error.message || "Internal Server Error")
            }
        },
        login: async (_, { input }, context) => {
            try {
                const { username, password } = input;
                const { user } = await context.authenticate("graphql-local", { username, password })

                await context.login(user);
                return user;
            } catch (error) {
                console.error("Error in login: ", error);
                throw new Error(error.message || "Internal Server Error")
            }
        },
        logout: async(_, __, context) => {
            try {
                await context.logout();
                context.req.session.destroy((err) => {
                    if(err) throw err;
                })
                context.res.clearCookie("connect.sid");
                return {message : "Logged Out Successfully"}
            } catch (error) {
                console.error("Error in logout: ", error);
                throw new Error(error.message || "Internal Server Error")
            }
        }
    }
};

export default userResolver;
