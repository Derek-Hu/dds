var xlsx = require('node-xlsx').default;
var fs = require('fs');
var path = require('path');

const parseLocalJson = () => {
    const url = path.resolve(__dirname, '../src/locale/en.js');
    const source = fs.readFileSync(url, 'utf8');
    return eval(`${source.replace('export default ', 'false? null: ')}`);
    // return JSON.parse(source.replace('export default ', ''));
}


const generateExcel = () => {
    const json = parseLocalJson();
    

    const data = [
        ['KEY', '英文', '泰文']
    ]

    Object.keys(json).forEach(key => {
        data.push([key, json[key], '']);
    });

    var buffer = xlsx.build([{name: "翻译内容", data: data}]); // Returns a buffer

    fs.writeFileSync('shield-translation.xlsx', buffer);
}

generateExcel();

module.exports = function parseExcel(path) {
    var sheets = xlsx.parse(fs.readFileSync(path));
    sheets.forEach(function(sheet) {
        var arrays = sheet.data;
        // remove columns 
        var colums = arrays.splice(0, 1)[0];

        sheet.data = arrays.reduce(function(allUsers, user) {
            allUsers[user[0]] = user[1];
            return allUsers;
        }, {});

        return sheet;
    })
    return sheets;
}
