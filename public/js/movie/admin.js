$(function(){
	$('#douban').blur(function(event) {
		var douban = $(this);
		var id = douban.val();
		if(id){
			$.ajax({
				url: 'https://api.douban.com/v2/movie/subject/' + id,
				cache: true,
				type: 'get',
				dataType: 'jsonp',
				crossDomain: true,
				jsonp: 'callback',
				success: function(data){
					$('#inputTitle').val(data.title);
					$('#inputDirector').val(data.directors[0].name);
					$('#inputCountry').val(data.countries[0]);
					$('#inputYear').val(data.year);
					$('#inputSummary').val(data.summary);
					$('#inputPoster').val(data.images.large);
					// $('#inputFlash').val(data.);
				}
			})
		}
	});
})