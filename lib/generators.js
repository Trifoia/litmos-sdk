'use strict';

module.exports.generateId = (context, name) => {
  return (value) => {
    context._addEndpoint(name);
    context._addEndpoint(value);

    return context;
  };
};

module.exports.generateGet = (context, name) => {
  return (params) => {
    context._addEndpoint(name);
    return context.get(params);
  };
};

module.exports.generateDetails = (context, name) => {
  return (params) => {
    context._addEndpoint(name);
    context._addEndpoint('details');
    return context.get(params);
  };
};

module.exports.generateSearch = (context, name) => {
  return (term, params = {}) => {
    context._addEndpoint(name);
    params.search = term;
    return context.get(params);
  };
};

module.exports.generatePost = (context, name) => {
  return (data, params) => {
    context._addEndpoint(name);
    return context.post(data, params);
  };
};

