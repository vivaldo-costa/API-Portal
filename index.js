import express from 'express';
import publicRouter from './routes/public.js';
import privateRouter from './routes/private.js';
import authMiddleware from './middlewares/auth.js';
import dotenv from 'dotenv';
import cors from 'cors';

// Carregar as variáveis do arquivo .env
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use('/routes', publicRouter);
app.use('/routes', authMiddleware, privateRouter);


/*
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


Nome de usuário:vivaldocosta29
Senha:vZlxw3LrCRfADS90 

mongodb+srv://vivaldocosta29:<db_password>@cluster0.pxhgn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

*/