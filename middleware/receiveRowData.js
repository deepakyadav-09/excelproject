const rowDataMiddleware = (req, res, next) => {

    const rowData = req.body;
    const rowValues = Object.values(req.body);
    const rowKeys = Object.keys(req.body);
    modifiedData = {};
    for (let i = 0; i < rowKeys.length; i++) {
        if (rowValues[i] == '') continue;
        modifiedData[rowKeys[i]] = rowValues[i];
        console.log(modifiedData, i);
    }

    res.locals.rowData = rowData;
    res.locals.modifiedData = modifiedData;

    console.log('------end of middleware------');
    next();
}

module.exports = {
    rowDataMiddleware
}
