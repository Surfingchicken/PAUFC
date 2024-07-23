import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { initRoutes } from './handlers/routes';
import { AppDataSource } from './database/database';
import 'dotenv/config';
import 'reflect-metadata';
import { swaggerDocs } from './swagger/swagger';

const main = async () => {
  const app = express();

  app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true
  }));

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    }
  });

  const upload = multer({ storage });

  app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

  const port = 3000;

  try {
    await AppDataSource.initialize();
    console.log('Connected to database');
  } catch (error) {
    console.error('Cannot contact database', error);
    process.exit(1);
  }

  swaggerDocs(app, port);

  app.use(express.json());

  app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }
    res.status(200).send({ filePath: `/uploads/${req.file.originalname}` });
  });

  initRoutes(app);

  app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ error: 'Route not found' });
  });

  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

main();
