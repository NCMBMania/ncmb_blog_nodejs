$('#post_form').on('submit', function(e) {
  e.preventDefault();
  sendForm({url: '/posts', form: $(this).serialize()})
});

$('#post_edit_form').on('submit', function(e) {
  e.preventDefault();
  
  sendForm({url: '/posts/'+this.elements.objectId.value, method: 'PUT', form: $(this).serialize()})
});

$("#login_form").on('submit', function(e) {
  e.preventDefault();
  sendForm({url: '/sessions', form: $(this).serialize()}, function() {
    var path = url('?path');
    if (path && path.match(/^\/.*/)) {
      return location.href = path;
    }
    return location.href = "/";
  });
});

$("#logout").on('click', function(e) {
  e.preventDefault();
  sendForm({url: '/sessions', method: "DELETE"});
});

$("#register_form").on('click', function(e) {
  e.preventDefault();
  sendForm({url: '/users', form: $(this).serialize()}, function(data) {
    location.href = "/login"
  });
});

function sendForm(params, callback) {
  params.method = params.method || 'POST'
  return $.ajax({
    url: params.url,
    type: params.method,
    data: params.form
  })
  .then(function(data) {
    if (typeof callback == 'function') {
      callback(data);
    } else {
      location.href = "/";
    }
  },
  function(err) {
    console.error(err);
  });
}

var textarea = $("form #body");
var cancelDrop = function(e) {
  e.preventDefault();
  e.stopPropagation();
  textarea.removeClass('drop');
  return false;
}
var startDrop = function(e) {
  textarea.addClass('drop');
  e.preventDefault();
  e.stopPropagation();
  return false;
}
textarea.bind("dragenter", startDrop);
textarea.bind("dragover",  startDrop);
textarea.bind("drop", function(e) {
  var file = e.originalEvent.dataTransfer.files[0];
  var fileReader = new FileReader();
  fileReader.onload = function(e) {
    $.ajax({
      url: '/posts/files',
      type: 'POST',
      data: e.target.result,
      contentType: false,
      processData: false
    })
    .then(function(result) {
      var cursorPos = textarea.prop('selectionStart');
      var v = textarea.val();
      var textBefore = v.substring(0,  cursorPos);
      var textAfter  = v.substring(cursorPos, v.length);
      textarea.val(textBefore + '![](' + result.url + ')' + textAfter);
    }, function(err) {
      console.log(error);
    })
  }
  fileReader.readAsBinaryString(file);
  cancelDrop(e);
});