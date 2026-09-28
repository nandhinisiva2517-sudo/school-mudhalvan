const xlsx = require('xlsx');
const workbook = xlsx.readFile('../TamilNadu_Schools_District_Wise_List.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const json = xlsx.utils.sheet_to_json(sheet, { header: 1 });
const sevamandir = json.filter(row => row[2] && row[2].toString().toLowerCase().includes('sevamandir'));
console.log('Schools with sevamandir in Excel:', sevamandir);
