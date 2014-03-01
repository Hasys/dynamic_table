window.onload = function(){
	window.dynamic_table_factory('table_one');
	window.dynamic_table_factory('table_two');
};



var dynamic_table_factory = function(id){

	var body = document.getElementsByTagName('body')[0];
	var table = document.getElementById(id);
	var hcells = table.getElementsByTagName('th');

	this.bindEvent = function(element, event, func) {
		if( element.addEventListener ) {
			element.addEventListener( event, func, false );
		} else if ( element.attachEvent ) {
			element.attachEvent( 'on'+event, func );
		}
	};

	this.unbindEvent = function(element, event, func) {
		if( element.removeEventListener ) {
			element.removeEventListener( event, func, false );
		} else if ( element.detachEvent ) {
			element.detachEvent( 'on'+event, func );
		}
	};

	var bodyMouseMoveEvent = function( event ) {
		druggedDiv.style.left = event.x+'px';
		druggedDiv.style.top = event.y+'px';
	}

	var headerMouseDownEvent = function( event ) {
		this.classList.add('down');
		var cell_width = 100;
		for(i = 0; i < hcells.length; i++)	{
			hcells[i].classList.add('cursor-move');
		}
		body.classList.add('text-not-selectable');
		body.classList.add('cursor-move');
		
		druggedDiv.style.display = 'block';
		var border = 2; //Two times width of borders in px
		druggedDiv.style.width = ( this.offsetWidth - border )+'px';
		druggedDiv.style.height = ( this.offsetHeight - border )+'px';
		druggedDiv.style.left = event.x+'px';
		druggedDiv.style.top = event.y+'px';
		druggedDiv.innerHTML = this.innerHTML;

		bindEvent( body, 'mouseup', bodyMouseUpEvent );
		bindEvent( body, 'mousemove', bodyMouseMoveEvent, true );
	};

	var bodyMouseUpEvent = function() {
		for(i = 0; i < hcells.length; i++)	{
			hcells[i].classList.remove('down');
			hcells[i].classList.remove('cursor-move');
		}
		unbindEvent( body, 'mouseup', bodyMouseUpEvent );
		unbindEvent( body, 'mousemove', bodyMouseMoveEvent );

		body.classList.remove('text-not-selectable');
		body.classList.remove('cursor-move');
		druggedDiv.style.display = 'none';
	};

	for(i = 0; i < hcells.length; i++)	{
		hcells[i].classList.add('cursor-pointer');
		bindEvent( hcells[i], 'mousedown', headerMouseDownEvent );
	}

	if(!this.druggedDiv) {
		this.druggedDiv = document.createElement('div');
		druggedDiv.classList.add('drugged-div');
		druggedDiv.style.display = 'none';
		body.appendChild(druggedDiv);
	}
};