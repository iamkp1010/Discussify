const express = require('express')
const cors = require('cors');
const morgan = require('morgan');

const app = express()

app.use(cors({
    origin: 'http://localhost:3000',
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true}))

app.get('/', (req,res)=>{
    res.json({okay:1});
})

module.exports = app