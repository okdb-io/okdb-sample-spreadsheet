
const initialGrid = [
  [
    { readOnly: true, value: '' },
    { value: 'Expences', readOnly: true },
    { value: 'Q1', readOnly: true },
    { value: 'Q2', readOnly: true },
    { value: 'Q3', readOnly: true },
    { value: 'Q4', readOnly: true },
  ],  
];

const expences = [
  "Accounting",
  "Advertising",
  "Hardware",
  "Insurance",  
  "Office Supplies",
  "Office Rent",
  "Payroll Expenses",
  "Software Licenses",
  "Telephone",
  "Travel",
  "Web hosting",
  

];

for(let i = 0; i < 15; i++) {
  initialGrid.push([
    { readOnly: true, value: i+1 },
    { value: expences[i]? expences[i] : ""},
    { value: ""},
    { value: ""},
    { value: ""},
    { value: ""},
  ])
}

initialGrid.push([
  { readOnly: true, value: 16 },
  { value: "Total:",readOnly: true},
  { value: 0, readOnly: true},
  { value: 0, readOnly: true},
  { value: 0, readOnly: true},
  { value: 0, readOnly: true},
]);

export default initialGrid;