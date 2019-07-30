const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
global.appRoot = path.resolve(__dirname);
const winston = require('./config/winston');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const employeesRoutes = require('./api/routes/employees/employees');
const departmentsRoutes = require('./api/routes/employees/departments');
const positionsRoutes = require('./api/routes/employees/positions');
const skillsRoutes = require('./api/routes/employees/skills');
const ordersRoutes = require('./api/routes/orders');
const productsRoutes = require('./api/routes/products');
const usersRoutes = require('./api/routes/users');
const authRoutes = require('./api/routes/auth');

const db = require('./config/db');

mongoose.connect(db.mongoURI, {
    useNewUrlParser: true
})
  .then(() => console.log('MongoDB was successfully connected'))
  .catch((err) => console.log(err));

app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

if(process.env.NODE_ENV !== 'test') {
    app.use(morgan('combined', {stream: winston.stream}));
}

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Accept, Authorization, Content-Type, Origin, X-Requested-With, Cache-Control'
    );
    if(req.method === 'OPTIONS') {
        res.header(
            'Access-Control-Allow-Methods',
            'GET, POST, PUT, PATCH, DELETE'
        );
        return res.status(200).json({});
    }
    next();
});

app.use('/employees', employeesRoutes);
app.use('/departments', departmentsRoutes);
app.use('/positions', positionsRoutes);
app.use('/skills', skillsRoutes);
app.use('/orders', ordersRoutes);
app.use('/products', productsRoutes);
app.use('/users', usersRoutes);
app.use('/auth', authRoutes);

app.use((req, res, next) => {
    if(req.originalUrl && req.originalUrl.split('/').pop() === 'favicon.ico') {
        return res.sendStatus(204);
    }    
    next();
});

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// For testing
module.exports = app;