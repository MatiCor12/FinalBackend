import mongoose from 'mongoose'

export const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.URL_MONGODB)
        console.log('Connected to DB ecommerce')
    } catch (error) {
        console.log(`Error creating DB ${error}`)
        process.exit(1)
    }
}
