import express from 'express';
import dotenv from 'dotenv';
import authRouter from './routes/auth.route.js';
import connectMongoDB from "./db/connectMongo.js"

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
// any requests whose path starts with /auth will be routed to the authRouter middleware for further processing
app.use('/auth', authRouter);

// Define a route
app.get('/', (req, res) => {
 res.send('AuthServer!');
});


// Start the server
app.listen(port, () => {
    connectMongoDB();
    console.log(`Auth Server is listening at http://localhost:${port}`);
});
