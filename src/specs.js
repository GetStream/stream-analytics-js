var validate = require('validate.js');

validate.validators.features = function (value/*, options, key, attributes */) {
  if (typeof (value) === 'undefined' || value === null)
      return value;
  if (!validate.isArray(value))
      return 'needs to be a list of features';
  for (var i = value.length - 1; i >= 0; i--) {
    if (validate(value[i], feature))
        return 'should have group and value keys';
  }
};

validate.validators.isArray = function (value/*, options, key, attributes */) {
  if (!validate.isArray(value))
      return 'needs to be an array';
};

validate.validators.isObject = function (value/*, options, key, attributes */) {
  if (!validate.isArray(value))
      return 'needs to be an array';
};

var feature = {
  group: { presence: true },
  value: { presence: true },
};

var engagement = {
  'label': { presence: true },
  'content': { presence: true },
  'boost': {
    presence: false,
    numericality: true,
  },
  'features': {
    features: true,
  },
};

var impression = {
  'content_list': {
    presence: true,
    isArray: true,
  },
  'boost': {
    presence: false,
    numericality: true,
  },
  'features': {
    features: true,
  },
};

module.exports = {
  engagementSpec: engagement,
  impressionSpec: impression,
};
