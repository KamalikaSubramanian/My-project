import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum : ["admin","user"]
         // 👈 only these values are allowed.the field value must be one of a predefined set of allowed values.enum is enumeration(a fixed list of possible values that a field can take.)
    }
},{
    timestamps:true
});
export const User = mongoose.model("User",userSchema)