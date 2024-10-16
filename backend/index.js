// Standalone server

// import {ApolloServer} from "@apollo/server"
// import {startStandaloneServer} from "@apollo/server/standalone"

// import mergedResolvers from "./graphql/resolvers/index.js"
// import mergedTypeDefs from "./graphql/typeDefs/index.js"

// const server = new ApolloServer({
//     typeDefs: mergedTypeDefs,
//     resolvers: mergedResolvers,
// })

// const {url} = await startStandaloneServer(server)
// console.log(`🚀 Server ready at : ${url}`)

// ---------------------------------------------

//Server With express
import express from "express";
import http from "http";
import cors from "cors"
import dotenv from "dotenv"
import { connectDB } from "./database/Mongo.js";

dotenv.config()

import passport from "passport";
import session from "express-session";
import connectMongo from "connect-mongodb-session";
import { configurePassport } from "./passport/passport.config.js";
import job from "./cron.js";


import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

import {buildContext} from "graphql-passport"

import mergedTypeDefs from "./graphql/typeDefs/index.js"
import mergedResolvers from "./graphql/resolvers/index.js"

const app = express()

const httpServer = http.createServer(app);

const MongoDBStore = connectMongo(session)

const store = new MongoDBStore({
    uri:process.env.MONGO_URI,
    collection: "session",
})

store.on("error" , (err) => console.error(err))
job.start()


app.use(
    session({
        secret: process.env.SESSION_SECRET,
		resave: false, // this option specifies whether to save the session to the store on every request
		saveUninitialized: false, // option specifies whether to save uninitialized sessions
		cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7,
			httpOnly: true, // this option prevents the Cross-Site Scripting (XSS) attacks
		},
		store: store,
	})
);

app.use(passport.initialize());
app.use(passport.session());
await configurePassport()

const server = new ApolloServer({
    typeDefs: mergedTypeDefs,
    resolvers: mergedResolvers,
    plugins: [ApolloServerPluginDrainHttpServer({httpServer})]
})

await server.start()

app.use(
    "/graphql",
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    }),
    express.json(),
    expressMiddleware(server ,{
        context: async ({ req, res }) => {
            // console.log("Request session data:", req.session);  // Log session data to verify it's being passed correctly
            return buildContext({ req, res });
          },
        
    })
)
await connectDB()

await new Promise((resolve) => httpServer.listen({port : 4000 } , resolve));
console.log(`🚀 Server ready at : http://localhost:4000`)

