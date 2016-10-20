$('#post_form').on('submit', function(e) {
  e.preventDefault();
  console.log(e);
  var data = $(this).serialize();
  $.ajax({
    url: '/posts',
    type: 'POST',
    data: data
  })
  .then(function(data) {
    location.href = "/";
  },
  function(err) {
    console.error(err);
  });
  
})