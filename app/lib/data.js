const fs = require('fs');
const path = require('path');

const { parseStringToJSON } = require('./helpers');

const fsPromises = fs.promises;

const lib = {};

lib.baseDir = path.join(__dirname, '/../.data/');

lib.create = async (dir, fileName, data) => {
  let fileHandleObject = null;

  try {
    fileHandleObject = await fsPromises.open(resolveDirName(dir, fileName), 'wx');
  } catch(err) {
    console.error(`Error when creating file ${fileName}: ${err}.`);
    throw err;
  }

  const stringifiedData = JSON.stringify(data);

  try {
    await fsPromises.writeFile(fileHandleObject, stringifiedData, null);
  } catch(err) {
    console.error(`Error when writing to file ${fileName}: ${err}.`);
    throw err;
  }

  try {
    await fileHandleObject.close();
  } catch(err) {
    console.error(`Error when closing the file ${fileName}: ${err}.`);
    throw err;
  }
};


lib.read = async (dir, fileName) => {
  try {
    const data = await fsPromises.readFile(resolveDirName(dir, fileName), 'utf-8');
    return parseStringToJSON(data);
  } catch(err) {
    console.error(`Error when reading the file ${fileName}: ${err}`);
    throw err;
  }
};

lib.update = async (dir, fileName, data) => {
  let fileHandleObject = null;

  try {
    fileHandleObject = await fsPromises.open(resolveDirName(dir, fileName), 'r+');
  } catch(err) {
    console.error(`Error when opening the file ${fileName}: ${err}`);
    throw err;
  }

  try {
    await fileHandleObject.truncate();
  } catch(err) {
    console.error(`Error when truncating the file ${fileName}: ${err}`);
    throw err;
  }

  try {
    const stringifiedData = JSON.stringify(data);
    await fsPromises.writeFile(fileHandleObject, stringifiedData, null);
  } catch(err) {
    console.error(`Error when truncating the file ${fileName}: ${err}`);
    throw err;
  }

  try {
    await fileHandleObject.close();
  } catch(err) {
    console.error(`Error when closing the file ${fileName}: ${err}`);
    throw err;
  }
};

lib.delete = async (dir, fileName) => {
  try {
    await fsPromises.unlink(resolveDirName(dir, fileName));
  } catch(err) {
    console.error(`Error when unlinking the file ${fileName}: ${err}`);
    throw err;
  }
};

function resolveDirName(dir, fileName, baseDir = lib.baseDir) {
  return `${baseDir}${dir}/${fileName}.json`;
}

module.exports = lib;
