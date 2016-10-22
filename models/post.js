module.exports = function(ncmb) {
  var Post = ncmb.DataStore('Post');
  Post.prototype.editable = function() {
    if (typeof ncmb.sessionToken === 'undefined') {
      return false;
    }
    if (this.acl['*'] && this.acl['*'].write)
      return true;
    objectId = ncmb.currentUser.objectId;
    if (this.acl[objectId] && this.acl[objectId].write)
      return true;
    return false;
  }
  return Post;
}
