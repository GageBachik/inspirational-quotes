var index = 0;
var lastDeleted;
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
			rating: [2,2,4]
		},
		{
			text: 'There are two ways of constructing a software design. One way is to make it so simple that there are obviously no deficiencies. And the other way is to make it so complicated that there are no obvious deficiencies.',
			author: 'C.A.R. Hoare',
			rating: [5]
		}
	]
};

function addRating(){
	$('.rate > a').on('click', function(e){
  		e.preventDefault();
  		var clicked = $(this).index();
  		var updated = $(this).closest('li').find('q').text();
		var newStoredQuotes = {
		quotes: $.grep(storedQuotes.quotes, function(e){ 
			if (e.text === updated) {
				e.rating.push(clicked+1);
			};
			
			return e; 
		})
		}
		localStorage.setItem('storedQuotes', JSON.stringify(newStoredQuotes));
		storedQuotes = newStoredQuotes;
		addQuotes(index);
  	});
}

function addQuotes(page, undo){
	var sliceCount =  (page * 5) + 5 || 0;
	page = Math.abs((page * 5)) || 0;
	var source   = $("#quotes-template").html();
	var template = Handlebars.compile(source);
	if (undo) {
		storedQuotes.quotes.push(undo);
	};
	var sorted = _.sortBy(storedQuotes.quotes, function(quote){
		var avg = 0;
		for (var i = 0; i < quote.rating.length; i++) {
			avg += quote.rating[i];
		};
		avg /= quote.rating.length;
		var stars = Math.round(avg);
		quote.avg = [];
		quote.left = [];
		for (var i = 0; i < stars; i++) {
			quote.avg.push({star: 'x'});
		};
		for (var i = quote.avg.length; i < 5; i++) {
			quote.left.push({openStar: 'o'});
		}
		return -avg;
	});

	var modifiedData = {
		quotes: sorted.slice(page,sliceCount)
	}

	var data = modifiedData;

	$("#quotes").empty( );
	$("#quotes").append(template(data));

	addRating();
	authorSort();
}

function addRemove(){
	$(document).on('click', '.delete', function(e){
		e.preventDefault();
		var updated = $(this).closest('li').find('q').text();
		$(this).closest('li').remove();
		var newStoredQuotes = {
		quotes: $.grep(storedQuotes.quotes, function(e){ 
			if (e.text !== updated) {
				return e;
			}else{
				lastDeleted = e;
			}
		})
		}
		localStorage.setItem('storedQuotes', JSON.stringify(newStoredQuotes));
		storedQuotes = newStoredQuotes;
		addQuotes(index);
		$('.undo').closest('div').css('border-left', '1px solid #111111')
		$('.undo').show();
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
	$('#foward').on('click', function(e){
  		e.preventDefault();
  		if ((index + 1) < (storedQuotes.quotes.length / 5)) {
  			index += 1;
  			addQuotes(index);
  		};
  	});
  	$('#back').on('click', function(e){
  		e.preventDefault();
  		if (index > 0) {
  			index -= 1;
  			addQuotes(index);
  		};
  	});
}

function undoDelete(){
	$('.undo').on('click', function(){
  		addQuotes(index, lastDeleted);
  		$('.undo').closest('div').css('border-left', '0px solid #111111')
  		$(this).hide();
  	});
}

function authorSort(){
	$('.author').on('click', function(){
  		var updated = $(this).closest('li').find('.author').text().split('-').join('');
		var newStoredQuotes = {
		quotes: $.grep(storedQuotes.quotes, function(e){ 
			if (e.author === updated) {
				return e; 
			};
		})
		}
		storedQuotes = newStoredQuotes;
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
  	undoDelete();

});