const PORT = 4009;
const express = require('express');
const app = express();
const { excelRoutes } = require('./routes/excelRoutes');
app.use(express.urlencoded({ extended: true }));
app.use('/excel', excelRoutes);


// this is for check of ngrok
app.get('/', (req, res) =>{
    res.send('this is by deepak and testing of ngrok')
})
app.listen(PORT, () => console.log('Server is SUCESSFULLY running on PORT', PORT));