import 'dotenv'

const config = {
    port: process.env.PORT || 8080,
    mongo: process.env.MONGO || 'mongodb+srv://pabloagusrivero:azqsxwdce01@cluster0.ypyomam.mongodb.net/ecommerce'
}
export default config