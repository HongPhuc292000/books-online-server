const _ = require("lodash");

const omitFieldsNotUsingInObject = (array, fields) => {
  return array.map((item) => {
    return _.omit(item, fields);
  });
};

module.exports = { omitFieldsNotUsingInObject };
