window.onload = function(){
	window.dynamic_table_factory('table_one');
	window.dynamic_table_factory('table_two');
};



var dynamic_table_factory = function(id){

	var body = document.getElementsByTagName('body')[0];
	var table = document.getElementById(id);
	var hcells = table.getElementsByTagName('tr')[0].getElementsByTagName('th');
	var draggableIndex = -1;
	var droppingID = -1;

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
		draggableDiv.style.left = (event.x +5)+'px'; //+5 for good looking and dragging
		draggableDiv.style.top = (event.y +5)+'px'; //+5 for good looking and dragging
	}

	var headMouseOverEvent = function( event ) {
		this.classList.add('can-to-drop');
	}
	var headMouseOutEvent = function() {
		this.classList.remove('can-to-drop');	
	}

	var headMouseMoveEvent = function( event ) {
		var currentNodeIndex = 0;
		var node = this;
		while (node = node.previousElementSibling)
			++currentNodeIndex;
		if (currentNodeIndex == draggableIndex)
			return;

		var halfOfWidth = Math.round(this.offsetWidth/2);
		if( currentNodeIndex < draggableIndex ) {
			if( event.offsetX < halfOfWidth ) {
				droppingID = currentNodeIndex;
				moveColumn();
				draggableIndex = currentNodeIndex;
			} else {
				droppingID = currentNodeIndex + 1;
				moveColumn();
				draggableIndex = currentNodeIndex + 1;
			}
		} else {
			if( event.offsetX > halfOfWidth ) {
				droppingID = currentNodeIndex+1;
				moveColumn();
				draggableIndex = currentNodeIndex;
			} else {
				droppingID = currentNodeIndex;
				moveColumn();
				draggableIndex = currentNodeIndex-1;
			}
		}
	}

	var headerMouseDownEvent = function( event ) {
		this.classList.add('down');
		for(i = 0; i < hcells.length; i++)	{
			hcells[i].classList.add('cursor-move');
			if( this == hcells[i] ) {
				draggableIndex = i;
			} else {
				bindEvent( hcells[i], 'mouseover', headMouseOverEvent );
				bindEvent( hcells[i], 'mouseout', headMouseOutEvent );
				bindEvent( hcells[i], 'mousemove', headMouseMoveEvent );
			}
		}

		body.classList.add('text-not-selectable');
		body.classList.add('cursor-move');

		draggableDiv.style.display = 'block';
		draggableDiv.style.width = ( this.offsetWidth )+'px';
		draggableDiv.style.left = event.x+'px';
		draggableDiv.style.top = event.y+'px';

		var rowsTmp = table.getElementsByTagName('tr');
		for( i=0; i<rowsTmp.length && i<=3; i++ ) {
			var element = document.createElement('div');
			if( i!=0 )
				element.style.borderTop = '1px #7e7e7e dotted';
			if(rowsTmp[i].children[draggableIndex] !== undefined)
				element.innerHTML = rowsTmp[i].children[draggableIndex].innerHTML;
			draggableDiv.appendChild(element);
		}

		bindEvent( body, 'mouseup', bodyMouseUpEvent );
		bindEvent( body, 'mousemove', bodyMouseMoveEvent, true );
	};

	var moveColumn = function() {
		if(droppingID == -1 || draggableIndex == -1) 
			return;
		var rowsTmp = table.getElementsByTagName('tr');
		var rows = new Array();
		for (i=0;i<rowsTmp.length;i++){
			if (rowsTmp.item(i).nodeType==1)
				rows.push(rowsTmp.item(i));
			
		}

		for(j = 0; j<rows.length; j++) {
			var tmpArr = new Array();
			var row = (j==0)? rows[j].getElementsByTagName('th') : rows[j].getElementsByTagName('td');
			for (i=0;i<row.length;i++){
				if (row.item(i).nodeType==1)
					tmpArr.push(row.item(i));
			}

			rows[j].innerHTML = '';

			for( i = 0; i<droppingID; i++ ) {
				if(i == draggableIndex) continue;
				rows[j].appendChild(tmpArr[i]);
			}
			if(tmpArr[draggableIndex] !== undefined)
			rows[j].appendChild(tmpArr[draggableIndex]);
			for( i=droppingID; i<tmpArr.length; i++){
				if(i == draggableIndex) continue;
				rows[j].appendChild(tmpArr[i]);
			}
		}

		hcells = table.getElementsByTagName('tr')[0].getElementsByTagName('th');
	};

	var bodyMouseUpEvent = function() {
		for(i = 0; i < hcells.length; i++)	{
			if (hcells[i].classList.contains('can-to-drop') ) {
				droppingID = i;
			}
			hcells[i].classList.remove('down');
			hcells[i].classList.remove('cursor-move');
			hcells[i].classList.remove('can-to-drop');
			unbindEvent( hcells[i], 'mousemove', headMouseMoveEvent );
			unbindEvent( hcells[i], 'mouseover', headMouseOverEvent );
			unbindEvent( hcells[i], 'mouseout', headMouseOutEvent )
		}
		body.classList.remove('text-not-selectable');
		body.classList.remove('cursor-move');
		
		draggableDiv.innerHTML = '';
		draggableDiv.style.display = 'none';

		unbindEvent( body, 'mouseup', bodyMouseUpEvent );
		unbindEvent( body, 'mousemove', bodyMouseMoveEvent );

		draggableIndex = -1;
	};

	for(i = 0; i < hcells.length; i++)	{
		hcells[i].classList.add('cursor-pointer');
		bindEvent( hcells[i], 'mousedown', headerMouseDownEvent );
	}

	if(!this.draggableDiv) {
		this.draggableDiv = document.createElement('div');
		draggableDiv.classList.add('draggable-div');
		draggableDiv.style.display = 'none';
		body.appendChild(draggableDiv);
	}
};