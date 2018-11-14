module.exports = (id, token) => {

  token = global.reverse(token);
  var idArr = id.match(/.{0,4}/g);
  var tokenArr = token.match(/.{0,4}/g);
  idArr.forEach(function (split, index) {

    console.log(index);
    tokenArr[index] = tokenArr[index] + split;
  })

  token = tokenArr.join();

  return token.replace(/,/g, '');

}