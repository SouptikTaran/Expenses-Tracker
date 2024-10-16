import mongoose from "mongoose";

export const connectDB = async () =>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI , {dbName: "TestDB"})
        .then((c) => {
            console.log(`Connected with ${c.connection.name}`);
        })
    }catch(error){
        console.error(`Error : ${error.message}`);
        process.exit(1);
    }
}
