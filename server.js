const express = require('express');

const mongodb = require ('./data/database');
const app = express();
const { notFound, handleError } = require('./middleware/errorHandler');

const PORT = process.env.PORT || 3010;

app.use(express.json());
app.use('/', require('./routes'));
app.use(notFound);
app.use(handleError);

mongodb.initDb((err) => {
    if(err) {
        console.log(err);
    }else{
        app.listen(PORT, () => {
        console.log(`Database is listening and server is running on port ${PORT}`);
});
    }
})

