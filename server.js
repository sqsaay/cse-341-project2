const express = require('express');
const app = express();

const PORT = process.env.PORT || 3010;

app.use('/', require('./routes'));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});