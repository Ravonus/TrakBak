module.exports = (func) => {
  Object.keys(func).forEach(function (key) {
    global[key] = func[key];
  });
}