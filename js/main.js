window.onload = function(){
	window.dynamic_table_factory('table_one');
	window.dynamic_table_factory('table_two');
};



var dynamic_table_factory = function(id){

	var body = document.getElementsByTagName('body')[0];
	var table = document.getElementById(id);
	var hcells = table.getElementsByTagName('tr')[0].getElementsByTagName('th');
	var ftmpcells = table.getElementsByTagName('tr')[0].childNodes;
	var fcells = new Array();

	var firstCellsOfRows = new Array();
	var tmpRows = table.getElementsByTagName('tr')
	for( i=0; i<tmpRows.length; i++ ) {
		var tmpChildren = tmpRows[i].childNodes;
		for( j=0; j<tmpChildren.length; j++ )
			if( tmpChildren[j].nodeType==1 ) {
				firstCellsOfRows.push( tmpChildren[j] );
				break;
			}
	}

	var draggableIndex = -1;
	var isResizing = false;
	var droppingID = -1;
	var startResizing = -1;
	var base = 0;
	var anothers;
	var previous;
	var notResize;

	this.bindEvent = function(element, event, func) {
		if( element.addEventListener ) {
			element.addEventListener( event, func, false );
		} else if ( element.attachEvent ) {
			element.attachEvent( 'on'+event, func );
		}
	};

	this.unbindEvent = function( element, event, func ) {
		if( element.removeEventListener ) {
			element.removeEventListener( event, func, false );
		} else if ( element.detachEvent ) {
			element.detachEvent( 'on'+event, func );
		}
	};

	var bodyMouseUpResizeStopEvent = function( event ) {
		for( i=0; i<fcells.length; i++ ) {
			if( fcells[i].nodeType==1 )
				unbindEvent( fcells[i], 'mouseup', bodyMouseUpResizeStopEvent );
		}
		isResizing = false;
		body.classList.remove( 'text-not-selectable' );
		unbindEvent( body, 'mousemove', bodyMouseMoveResizeEvent );
	}

	var bodyMouseUpVerticalResizeStopEvent = function( event ) {
		for( i=0; i<firstCellsOfRows.length; i++ )
			unbindEvent( firstCellsOfRows[i], 'mouseup', bodyMouseUpVerticalResizeStopEvent );
		body.classList.remove('text-not-selectable' );
		unbindEvent( body, 'mousemove', bodyMouseMoveVerticalResizeEvent );
	}

	var firstLineMouseDownEvent = function( event ) {
		bindEvent( body, 'mouseup', bodyMouseUpResizeStopEvent );
		startResizing = event.x;
		previous = event.x;
		base = this.offsetWidth;
		resizing = this;
		body.classList.add('text-not-selectable');
		bindEvent( body, 'mousemove', bodyMouseMoveResizeEvent );
		notResize = new Array( fcells.length );
		for( i=0; i<fcells.length; i++ ) {
			if( fcells[i] != resizing )
				notResize[i] = fcells[i].width;
		}
	}

	var firstRowMouseDownEvent = function( event ) {
		bindEvent( body, 'mouseup', bodyMouseUpVerticalResizeStopEvent );
		body.classList.add('text-not-selectable');
		bindEvent( body, 'mousemove', bodyMouseMoveVerticalResizeEvent );
		startResizing = event.y;
		resizing = this;
		base = this.offsetHeight;
	}

	var bodyMouseMoveResizeEvent = function( event ) {
		resizing.width = (base + event.x - startResizing)+'px';
		table.width = (event.x -previous) + table.offsetWidth +'px';
		for( i=0; i<fcells.length; i++ ) {
			if( fcells[i].nodeType == 1 && fcells[i] != resizing ) {
				fcells[i].width = notResize[i];
			}
		}
		previous = event.x;
	}

	var bodyMouseMoveVerticalResizeEvent = function( event ) {
		resizing.height = (base + event.y - startResizing)+'px';
	}

	var firstLineMouseMoveEvent = function( event ) {
		if( this.offsetWidth-event.offsetX<4 ) {
			bindEvent( this, 'mousedown', firstLineMouseDownEvent);
			for( i=0; i<hcells.length; i++ ) {
				unbindEvent( hcells[i], 'mousedown', headerMouseDownEvent );
			}
		} else {
			unbindEvent( this, 'mousedown', firstLineMouseDownEvent);
			for( i=0; i<hcells.length; i++ ) {
				bindEvent( hcells[i], 'mousedown', headerMouseDownEvent );
			}
		}
	}

	var firstCellsOfRowsMouseMoveEvent = function( event ) {
		if( this.offsetHeight-event.offsetY<4 ) {
			bindEvent( this, 'mousedown', firstRowMouseDownEvent);
		} else {
			unbindEvent( this, 'mousedown', firstRowMouseDownEvent);
		}
		if( this.offsetWidth-event.offsetX<4 || this.offsetHeight-event.offsetY<4 )
			unbindEvent( firstCellsOfRows[0], 'mousedown', headerMouseDownEvent );
		else
			bindEvent( firstCellsOfRows[0], 'mousedown', headerMouseDownEvent );
	}

	var bodyMouseMoveEvent = function( event ) {
		draggableDiv.style.left = (event.x +5)+'px'; //+5 for good looking and dragging
		draggableDiv.style.top = (event.y +5)+'px'; //+5 for good looking and dragging
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
				moveColumn(draggableIndex, currentNodeIndex);
			} else {
				moveColumn(draggableIndex, currentNodeIndex + 1);
			}
		} else {
			if( event.offsetX > halfOfWidth ) {
				moveColumn(draggableIndex, currentNodeIndex);
			} else {
				moveColumn(draggableIndex, currentNodeIndex-1);
			}
		}
	}

	var headerMouseDownEvent = function( event ) {
		this.classList.add( 'down' );
		for(i = 0; i < hcells.length; i++)	{
			if( this == hcells[i] ) {
				draggableIndex = i;
			} else {
				bindEvent( hcells[i], 'mousemove', headMouseMoveEvent );
			}
		}

		body.classList.add('text-not-selectable');

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

	var moveColumn = function( from, to ) {
		if( from==to ) return;
		var tmpHeight = new Array();
		if( from==0 || to==0 ) {
			for( i=0; i<firstCellsOfRows.length; i++ ) {
				unbindEvent( firstCellsOfRows[i], 'mousemove', firstCellsOfRowsMouseMoveEvent );
				tmpHeight.push( firstCellsOfRows[i].height );
				firstCellsOfRows[i].height = '';
			}
		}

		var rows = table.getElementsByTagName('tr');
		
		var colspan = 0;
		var colspans = new Array();
		for( i=0; i<rows.length; i++) {
			var children = (i==0)? rows[i].getElementsByTagName('th'): rows[i].getElementsByTagName('td');
			var tmpTr = new Array(children.length);		
			var tmpTo = 0;
			var tmpFrom = 0;
			
			for( j=0; j<children.length; j++ ) {
				if( i==0 )
					colspans[j]=children[j].colSpan;
				if( j<to )
					tmpTo+=colspans[j];
				if( j<from )
					tmpFrom += colspans[j];
			}

			tmpTo = (i==0)? to: tmpTo;
			tmpFrom = (i==0)? from: tmpFrom;
			
			if( i==0 ) {
				colspan = children[tmpFrom].colSpan;
				tmpTr[tmpTo] = children[tmpFrom];
				if(from<to){
					var tmpColspan = colspans[to];
					colspans[to] = colspans[from];
					colspans[from] = tmpColspan;
				}
			} else {
				for( j=0; j<colspan; j++) {
					tmpTr[tmpTo+j] = children[tmpFrom+j];
				}
			}
			
			var j=0;
			var index = 0;
			while( j<children.length) {
				
				if( j==tmpFrom && i==0 ) {
					j++;
					continue;
				} else if ( (j>=tmpFrom && j<tmpFrom+colspan) && (i!=0) ) {
					j++;
					continue;
				}

				if(tmpTr[index] !== undefined) {
					index++;
				} else {
					tmpTr[index] = children[j];
					j++;
					index++;
				}
			}

			rows[i].innerHTML = '';
			for( j=0; j<tmpTr.length; j++)
				rows[i].appendChild(tmpTr[j]);

			draggableIndex = to;
		}

		hcells = table.getElementsByTagName('tr')[0].getElementsByTagName('th');
		if( from==0 || to==0 ) {
			firstCellsOfRows.length = 0;
			tmpRows = table.getElementsByTagName('tr')
			for( i=0; i<tmpRows.length; i++ ) {
				var tmpChildren = tmpRows[i].childNodes;
				for( j=0; j<tmpChildren.length; j++ )
					if( tmpChildren[j].nodeType==1 ) {
						firstCellsOfRows.push( tmpChildren[j] );
						break;
					}
			}
			for( i=0; i<firstCellsOfRows.length; i++ ) {
				bindEvent( firstCellsOfRows[i], 'mousemove', firstCellsOfRowsMouseMoveEvent );
				firstCellsOfRows[i].height = tmpHeight[i]+'px';
			}
		}
	};

	var bodyMouseUpEvent = function() {
		for(i = 0; i < hcells.length; i++)	{
			if (hcells[i].classList.contains('can-to-drop') ) {
				droppingID = i;
			}
			hcells[i].classList.remove('down');
			hcells[i].classList.remove('can-to-drop');
			unbindEvent( hcells[i], 'mousemove', headMouseMoveEvent );
		}
		body.classList.remove('text-not-selectable');
		
		draggableDiv.innerHTML = '';
		draggableDiv.style.display = 'none';

		unbindEvent( body, 'mouseup', bodyMouseUpEvent );
		unbindEvent( body, 'mousemove', bodyMouseMoveEvent );
	};

	for( i=0; i<hcells.length; i++ ) {
		bindEvent( hcells[i], 'mousedown', headerMouseDownEvent );
	}

	for( i=0; i<ftmpcells.length; i++ ) {
		if( ftmpcells[i].nodeType == 1 ) {
			bindEvent( ftmpcells[i], 'mousemove', firstLineMouseMoveEvent );
			ftmpcells[i].width = ftmpcells[i].offsetWidth+'px';
			fcells.push(ftmpcells[i]);
		}
	}

	for( i=0; i<firstCellsOfRows.length; i++ ) {
		bindEvent( firstCellsOfRows[i], 'mousemove', firstCellsOfRowsMouseMoveEvent );
		firstCellsOfRows[i].height = firstCellsOfRows[i].offsetHeight+'px';
	}


	if(!this.draggableDiv) {
		this.draggableDiv = document.createElement('div');
		draggableDiv.classList.add('draggable-div');
		draggableDiv.style.display = 'none';
		body.appendChild(draggableDiv);
	}
};