const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, data) => {
    var id = data;
    items[id] = text;
    var fileID = path.join(exports.dataDir, id);
    fs.writeFile(`${fileID}.txt`, text, () => {
      callback(null, { id, text });
    });
  });
};

exports.readAll = (callback) => {
  var files = [];
  fs.readdir(exports.dataDir, (err, data) => {
    if (err) {
      console.log('Error');
    } else {
      data.forEach((file) => {
        let rObj = {};
        rObj.id = file.slice(0, 5);
        rObj.text = file.slice(0, 5);
        files.push(rObj);
      });
    }
    callback(null, files);
  });
  return files;
};

exports.readOne = (id, callback) => {
  var itemPath = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(itemPath, 'utf8', (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, {id, text: data});
    }
  });
};

exports.update = (id, text, callback) => {
  var itemPath = path.join(exports.dataDir, `${id}.txt`);

  fs.readFile(itemPath, 'utf8', (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(itemPath, text, (err) => {
        if (err) {
          callback(new Error(`No item with id: ${id}`));
        } else {
          callback(null, { id, text });
        }
      });
    }
  });

};

exports.delete = (id, callback) => {
  var itemPath = path.join(exports.dataDir, `${id}.txt`);
  fs.unlink(itemPath, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
