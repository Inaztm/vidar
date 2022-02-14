const fieldsToObject = /* @ngInject */ () => (value) => (value || [])
  .filter(t => t.exportField)
  .reduce((acc, item) => {
    acc[item.exportField.name] = item.content;
    return acc;
  }, {});

export default fieldsToObject;
