const {getBrands} = require('node-car-api');
const fs = require('fs');

async function print () {
  const brands = await getBrands();

  console.log(brands);
  fs.appendFile('Brands.json',JSON.stringify(brands,null,2),null, function (err) {
    if (err) throw err;
  })};

const {getModels} = require('node-car-api');

async function print2 () {
  const models = await getModels('PEUGEOT');

  console.log(models);
  fs.appendFile('Models.json',JSON.stringify(models,null,2),null, function (err) {
    if (err) throw err;
  })};

print();

print2();
