const xlsx = require('xlsx');
const workbook = xlsx.readFile('../TamilNadu_Schools_District_Wise_List.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const json = xlsx.utils.sheet_to_json(sheet, { header: 1 });
console.log('Row 0 (Headers):', json[0]);
console.log('Row 1:', json[1]);
console.log('Row 2:', json[2]);
console.log('Row 3:', json[3]);
