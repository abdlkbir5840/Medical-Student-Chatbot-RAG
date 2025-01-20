const express = require('express');
require('dotenv').config();
const path = require('path');
const prisma = require('./models/prismaClient');
const router = require('./routes/router');
const cors = require('cors');  // Import the cors package


const app = express();

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'welcome.html'));
});

app.use('/api/v1', router)

const startServer = async () =>{
    try {
        // await prisma.$connect()
        const PORT = process.env.PORT || 8080;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
          });          
    } catch (error) {
        console.error('Failed to connect to database or port already in use', error);
        process.exit(1);
    }
}

startServer()