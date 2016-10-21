$('#post_form').on('submit', function(e) {
  e.preventDefault();
  sendForm({url: '/posts', form: this})
});

$("#login_form").on('submit', function(e) {
  e.preventDefault();
  sendForm({url: '/sessions', form: this});
});

$("#logout").on('click', function(e) {
  e.preventDefault();
  sendForm({url: '/sessions', method: "DELETE"});
});

$("#register_form").on('click', function(e) {
  e.preventDefault();
  sendForm({url: '/users', form: this}, function(data) {
    location.href = "/login"
  });
});

function sendForm(params, callback) {
  params.method = params.method || 'POST'
  var data = $(params.form).serialize();
  return $.ajax({
    url: params.url,
    type: params.method,
    data: params.data
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
