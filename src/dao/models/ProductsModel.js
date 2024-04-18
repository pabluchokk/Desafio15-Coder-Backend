import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import UserModel from "./userModel";

const productSchema = new mongoose.Schema({
    title: {
    type: String,
    require: true,
    },
    description: {
        type: String,
        require: true,
    },
    price: {
        type: Number,
        require: true,
    },
    thumbnail: {
        type: String,
        require: true,
    },
    code: {
        type: String,
        require: true,
    },
    stock: {
        type: Number,
        require: true,
    },
    category: {
        type: String,
        require: true
    },
    owner: {
        type: String,
        default: "admin",
        validate: {
            async function (ownerEmail) {
                const user = await UserModel.findOne({email: ownerEmail})
                return user && user.role === "premium";
            },
            message: props => `${props.value} no es un usuario premium`
        },
    }
});

productSchema.plugin(mongoosePaginate)

const ProductModel = mongoose.model("products", productSchema)

export default ProductModel