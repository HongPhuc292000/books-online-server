const _ = require("lodash");

const omitFieldsNotUsingInObject = (array, fields) => {
  return array.map((item) => {
    return _.omit(item, fields);
  });
};

const pickFieldsUsingInObject = (array, fields) => {
  return array.map((item) => {
    return _.pick(item, fields);
  });
};

module.exports = { omitFieldsNotUsingInObject, pickFieldsUsingInObject };
