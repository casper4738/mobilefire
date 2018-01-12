(function(){
	function readURL(input) {

  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function(e) {
      $('#imgPreview').attr('src', e.target.result);
      document.getElementById('imgPreview').style.display = 'block';
    }

    reader.readAsDataURL(input.files[0]);
	  }
	}

	$("#idInput").change(function() {
	  readURL(this);
	});
})();

