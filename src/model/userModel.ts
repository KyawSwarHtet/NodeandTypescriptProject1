import mongoose from "mongoose";
const { Schema } = mongoose;
const UserSchema = new Schema(
    {

        username: {
            type: String,
            require: true
        },
        email: {
            type: String,
            require: true
        },
        password: {
            type: String,
            require: true
        },
        login: {
            type: Boolean,
            require: true,
            default: false
        },
        gender: {
            type: String,
            default: "",
        },
        address: {
            type: String,
            default: ""
        },
        profilePicture: {
            type: [],
            require: true,
            default: null
        },

    }, {
    timestamps: true
}
);
const UserModel = mongoose.model("user", UserSchema);
export default UserModel;