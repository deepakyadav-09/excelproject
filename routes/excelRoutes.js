const express = require('express');
const excelRoutes = express.Router();
const { rowDataMiddleware } = require('../middleware/receiveRowData');
const { create, insert, update, remove } = require('../controller/excelController');

excelRoutes.post('/create', rowDataMiddleware, create);

excelRoutes.route('/:sheet')
    .post(rowDataMiddleware, insert)
    .patch(rowDataMiddleware, update);

excelRoutes.delete('', rowDataMiddleware, remove);

module.exports = {
    excelRoutes
}