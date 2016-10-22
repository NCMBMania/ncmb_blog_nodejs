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
      location.href = path;
    }
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
