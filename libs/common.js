module.exports = {
  setSessionToken: function(req, ncmb) {
    if (req.session.currentUser) {
      var currentUser = new ncmb.User(req.session.currentUser);
      if (currentUser) {
        ncmb.sessionToken = currentUser.sessionToken;
        ncmb.currentUser = currentUser;
      }
    }
  },
  detectFileType: function(bytes) {
    if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[bytes.length-2] === 0xff && bytes[bytes.length-1] === 0xd9) {
      return "jpg";
    } else if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
      return "png";
    } else if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) {
      return "gif";
    }
    return false;
  },
  guid: function() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }
};
