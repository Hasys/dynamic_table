window.onload = function(){
	window.dynamic_table_factory('table_one');
	window.dynamic_table_factory('table_two');
}

var dynamic_table_factory = function(id){
	var table = document.getElementById(id);
	
	table.onclick = function(){
		alert('Hello from ' + id);
	}
}