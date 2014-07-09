var index = 0;
var storedQuotes = {
	quotes: [
		{
			text: 'You miss 100% of the shots you don’t take.',
			author: 'Wayne Gretzky',
			rating: [5,5,5]
		},
		{
			text: 'Whether you think you can or you think you can’t, you’re right.',
			author: 'Henry Ford',
			rating: [4,3,3,2,1]
		},
		{
			text: 'Success is like breathing, got to find a way.',
			author: 'Erick Longnecker',
			rating: [4,1,5,3]
		},
		{
			text: 'When I let go of what I am, I become what I might be.',
			author: 'Lao Tzu',
			rating: [3,3,3,3,3]
		},
		{
			text: 'We must believe that we are gifted for something, and that this thing, at whatever cost, must be attained.',
			author: 'Marie Curie',
			rating: [1]
		},
		{
			text: 'If you want to lift yourself up, lift up someone else.',
			author: 'Booker T. Washington',
			rating: [4,4,5]
		},
		{
			text: 'I didn’t fail the test. I just found 100 ways to do it wrong.',
			author: 'Benjamin Franklin',
			rating: [2,2,6]
		},
	]
};

function addQuotes(page){
	var sliceCount =  (page * 5) + 5 || 0;
	page = Math.abs((page * 5)) || 0;
	var source   = $("#quotes-template").html();
	var template = Handlebars.compile(source);
	var modifiedData = {
		quotes: storedQuotes.quotes.slice(page,sliceCount)
	}
	var data = modifiedData;
	console.log(page,sliceCount);
	$("#quotes").empty( );
	$("#quotes").append(template(data));
}

function addRemove(){
	$(document).on('click', '.delete', function(e){
		e.preventDefault();
		var updated = $(this).closest('li').find('q').text()
		$(this).closest('li').remove()
		var newStoredQuotes = {
		quotes: $.grep(storedQuotes.quotes, function(e){ 
			return e.text !== updated; 
		})
		}
		localStorage.setItem('storedQuotes', JSON.stringify(newStoredQuotes));
		storedQuotes = newStoredQuotes;
	});
}

function quoteBar(){
	$('.quote-bar').on('click', '.add', function(){
  		 $('.add-quote').bPopup({
            speed: 450,
            transition: 'slideDown'
        });
  	});

  	$('.quote-bar').on('click', '.random', function(){
  		var quote = storedQuotes.quotes[_.random(0, storedQuotes.quotes.length-1)];

  		$('.random-text').text(quote.text);
  		$('.random-author').text('-'+quote.author);
  		 $('.random-quote').bPopup({
            speed: 450,
            transition: 'slideDown'
        });
  	});

  	$('.add-quote').on('click', '.quote-submit', function(){
  		var text = $('#quote-input').val();
  		var author = $('#author-input').val();
  					 $('#quote-input').val('');
  					 $('#author-input').val('');
  		var quote = {
  			text: text,
			author: author,
			rating: []
  		}
  		storedQuotes.quotes.push(quote);
  		console.log(storedQuotes);
  		localStorage.setItem('storedQuotes', JSON.stringify(storedQuotes));
  		$('.add-quote').bPopup().close();
  	});
}

function addPagination(){
	$('#foward').on('click', function(){
  		index += 1;
  		addQuotes(index);
  	});
  	$('#back').on('click', function(){
  		index -= 1;
  		addQuotes(index);
  	});
}

$(document).on('ready', function() {

	if (localStorage.getItem('storedQuotes') !== null){
		storedQuotes = JSON.parse(localStorage.getItem('storedQuotes'));
	} else{
		localStorage.setItem('storedQuotes', JSON.stringify(storedQuotes));
	}

	quoteBar();
  	addQuotes(index);
  	addRemove();
  	addPagination();

  	


});