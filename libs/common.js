module.exports = {
  setSessionToken: function(req, ncmb) {
    if (req.session.currentUser) {
      var currentUser = new ncmb.User(req.session.currentUser);
      if (currentUser) {
        ncmb.sessionToken = currentUser.sessionToken;
        ncmb.currentUser = currentUser;
      }
    }
  }
};
