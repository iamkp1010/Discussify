const express = require('express')
const cors = require('cors');
const morgan = require('morgan');
const apis = require('./routes/apis');
const app = express()
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(helmet());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true}))
// app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api', apis);
// app.get('/*', (req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
// });

module.exports = app