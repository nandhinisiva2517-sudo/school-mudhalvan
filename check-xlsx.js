const xlsx = require('xlsx');
const workbook = xlsx.readFile('../TamilNadu_Schools_District_Wise_List.xlsx');
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const json = xlsx.utils.sheet_to_json(sheet, { header: 1 });
console.log('Headers:', json[0]);
console.log('Sample Row 1:', json[1]);
