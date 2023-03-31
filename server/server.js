import express from 'express';
import morgan from 'morgan';

const server = express();

server.use(morgan('dev'))

server.get('/', (req, res) => {
    console.log('first')
})


server.listen(3000, () => {
    console.log('server runnging on port 3000');
});
