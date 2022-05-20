module.exports = function validexistence(data, shouldexis, res) {
  let error = false;
  for (const i in shouldexis) {
    if (
      data[shouldexis[i]] === undefined ||
      data[shouldexis[i]] === null ||
      data[shouldexis[i]].length === 0
    ) {
      (error = true),
        res.status(res.statusCode).json({
          error: true,
          message: `${shouldexis[i]}  was required `,
        });
      return true;
    }
    if (shouldexis[i] === 'email') {
      if (!ValidateEmail(data[shouldexis[i]])) {
        res.status(res.statusCode).json({
          error: true,
          message: 'Email format is incorrect ',
        });
        return true;
      }
    }
  }
  return error;
};
function ValidateEmail(email) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return true;
  }
  return false;
}
