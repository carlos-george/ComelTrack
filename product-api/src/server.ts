import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import path from 'path';
import requireDir from 'require-dir';
import routes from './routes';

// iniciando o app / servidor
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Iniciando banco de dados
// mongoose.connect(process.env.MONGO_URL!,
//     {
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//     });

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

requireDir('./models');

// Rotas
app.use("/api", routes);

app.listen(3001, () => console.log('#### Server is running on port:3001 ####'));