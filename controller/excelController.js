const xlsx = require('xlsx');
const Path = require('path');
const { mailToUser } = require('../mailer');
const { copyFileSync } = require('fs');

const create = async (req, res) => {
    const subject = 'table created sucessfully';
    const modifiedData = res.locals.modifiedData;
    const userEmail = modifiedData.email;
    const userName = modifiedData.name;
    // console.log(modifiedData);
    const keysLength = Object.keys(modifiedData).length;
    if (keysLength == 5) {
        const upcomingFile = xlsx.readFile('./excelSheet.xlsx');
        let data = [modifiedData];
        data = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(upcomingFile, data);
        xlsx.writeFile(upcomingFile, './excelSheet.xlsx');
        mailToUser(userEmail, userName, subject);
        res.send({
            status: 'table created sucessfully',
        });
    } else {
        res.send('only five fields required!!!');
    }
}

const insert = (req, res) => {
    const subject = 'record inserted sucessfully';
    const modifiedData = res.locals.modifiedData;
    const dataLength = Object.values(modifiedData).length;
    const userSheet = Path.parse(req.url).name;
    const upcomingFile = xlsx.readFile('./excelSheet.xlsx');
    const sheetName = upcomingFile.SheetNames;
    const userEmail = modifiedData.email;
    const userName = modifiedData.name;

    if (dataLength == 4) {
        if (sheetName.includes(userSheet)) {
            let sheetData = xlsx.utils.sheet_to_json(upcomingFile.Sheets[userSheet]);
            for (let j = 0; j < sheetData.length; j++) {
                if (sheetData[j].email == userEmail) {
                    res.send({
                        Warning: 'user already exists!!'
                    });
                    break;
                }
                if (sheetData[j] == sheetData.at(-1)) {
                    modifiedData.id = Number(sheetData[j].id) + 1;
                    sheetData.push(modifiedData);
                    sheetData = xlsx.utils.json_to_sheet(sheetData);
                    upcomingFile.Sheets[userSheet] = sheetData;
                    xlsx.writeFile(upcomingFile, './excelSheet.xlsx');

                    mailToUser(userEmail, userName, subject);

                    res.send({
                        status: 'inserted sucessfully!!!!!!!',
                        user: modifiedData
                    });
                }
            }
        } else {
            res.send({
                status: 'table name not exists, Please enter valid name.....'
            });
        }
    } else {
        res.send('please enter required field only!!!!!!');
    }
}

const update = (req, res) => {
    const subject = 'record updated sucessfully';
    const modifiedData = res.locals.modifiedData;
    const upcomingFile = xlsx.readFile('./excelSheet.xlsx');
    const userSheetName = Path.parse(req.url).name;
    const existingSheetName = upcomingFile.SheetNames;
    const userEmail = modifiedData.email;
    const userName = modifiedData.name;
    let data = xlsx.utils.sheet_to_json(upcomingFile.Sheets[userSheetName]);
    // console.log('data', data)
    if (modifiedData.email && existingSheetName.includes(userSheetName)) {
        for (let i = 0; i < data.length; i++) {
            if (data[i].email == modifiedData.email) {
                const user = Object.assign(data[i], modifiedData);
                data = xlsx.utils.json_to_sheet(data);
                upcomingFile.Sheets[userSheetName] = data;
                xlsx.writeFile(upcomingFile, './excelSheet.xlsx');
                mailToUser(userEmail, userName, subject);
                res.send({
                    status: 'Updated Sucessfully!!!!!!',
                    user
                });
                break;
            }
            if (data[i] == data.at(-1)) {
                res.send({
                    Msg: 'User not Exists....'
                })
            }
        }
    } else {
        res.send('warning : Please check email id and sheetname!!!!');
    }
}

const remove = (req, res) => {
    const subject = 'user deleted sucessfully';
    const userEmail = req.query.email;
    const upcomingFile = xlsx.readFile('./excelSheet.xlsx');
    const userSheetName = req.query.sheetName;
    const existingSheetName = upcomingFile.SheetNames;
    let data = xlsx.utils.sheet_to_json(upcomingFile.Sheets[userSheetName]);
    // console.log(data)
    if (existingSheetName.includes(userSheetName)) {
        for (let i = 0; i < data.length; i++) {
            if (data[i].email == userEmail) {
                console.log('email matched');
                const userName = data[i].name;
                data.splice(i, 1);
                data = xlsx.utils.json_to_sheet(data);
                upcomingFile.Sheets[userSheetName] = data;
                xlsx.writeFile(upcomingFile, 'excelSheet.xlsx');
                mailToUser(userEmail, userName, subject);
                res.send({
                    status: 'user deleted sucessfully'
                })
                break;
            }
            if (data[i] == data.at(-1)) {
                console.log('email do not match')
                res.send('user Not exists...!');
            }
        }
    } else {
        res.send('please enter valid detail...!');
    }
}

module.exports = {
    create,
    insert,
    update,
    remove
}