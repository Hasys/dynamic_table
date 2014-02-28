window.onload = function(){
	window.dynamic_table_factory('table_one');
	window.dynamic_table_factory('table_two');
};



var dynamic_table_factory = function(id){

	var body = document.getElementsByTagName('body')[0];
	var table = document.getElementById(id);
	var hcells = table.getElementsByTagName('th');

	var bindEvent = function(element, event, func) {
		if( element.addEventListener ) {
			element.addEventListener( event, func, false );
		} else if ( element.attachEvent ) {
			element.attachEvent( 'on'+event, func );
		}
	};

	var unbindEvent = function(element, event, func) {
		if( element.removeEventListener ) {
			element.removeEventListener( event, func, false );
		} else if ( element.detachEvent ) {
			element.detachEvent( 'on'+event, func );
		}
	};

	var headerMouseDownEvent = function() {
		this.classList.add('down');
		for(i = 0; i < hcells.length; i++)	{
			hcells[i].classList.add('cursor-move');
		}
		body.classList.add('text-not-selectable');
		body.classList.add('cursor-move');
		bindEvent( body, 'mouseup', bodyMouseUpEvent );
	};

	var bodyMouseUpEvent = function() {
		console.log('Event! ' + id);
		for(i = 0; i < hcells.length; i++)	{
			hcells[i].classList.remove('down');
			hcells[i].classList.remove('cursor-move');
			body.classList.remove('cursor-move');
		}
		unbindEvent( body, 'mouseup', bodyMouseUpEvent );
		body.classList.remove('text-not-selectable');
	};

	for(i = 0; i < hcells.length; i++)	{
		hcells[i].classList.add('cursor-pointer');
		bindEvent( hcells[i], 'mousedown', headerMouseDownEvent );
	}
};