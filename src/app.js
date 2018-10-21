import express from 'express';
import cors from 'cors';
import route from './routes/index';
import methodOverride from 'method-override';


const app = express()
app.use(cors());
app.use(express.json());
app.use('/api/v1', route);
app.use(methodOverride())
app.use((err, req, res, next) => {
    res.status(400).json({
        error: err.message });
});

export default app;