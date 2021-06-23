$(document).ready(function(){


	var statement = '';

	$("#key-eql").on('click',function(){
		statement = $('#formula').text().trim();

		calculate(/\d+(?:\.\d+)?[\/×]\d+(?:\.\d+)?/); // multipy and divide pattern
		calculate(/\d+(?:\.\d+)?[\-\+]\d+(?:\.\d+)?/); // plus and minus pattern

		$('#total').text(statement);

	});


	let calculate = (pattern) => {
		
		if(statement.search(pattern) > -1){
			let [result] = statement.match(pattern);
			let [op] = getOperator(result);
			let [operand1, operand2] = getOperands(result,op);
			let calc_val = compute([operand1, operand2], op);

			statement = statement.replace(result,calc_val);
			calculate(pattern);
		}
	}


	let getOperator = (statement) => {
		return statement.match(/[\+\-\/×]/);
	}

	let getOperands = (statement, op) => {
		return statement.split(op);
	}

	let compute = (operands, operator) => {
		switch(operator){
			case '+':
				return Number(operands[0]) + Number(operands[1]);
			case '-':
				return Number(operands[0]) - Number(operands[1]);
			case '×':
				return Number(operands[0]) * Number(operands[1]);
			case '/':
				return Number(operands[0]) / Number(operands[1]);								
		}
	}


	$(document).on('click','.key',function(){
		let val = $(this).data('value');
		$('#formula').append(val);

		if(!['+','-','×','/'].includes(val)){
			statement = $('#formula').text().trim();
			let pattern = /\d+(?:\.\d+)?[\/×\+\-]\d+(?:\.\d+)?/ // general pattern for checking
			if(statement.search(pattern) > -1){
				// cleanup operators placed at the front and end
				statement = statement.replace(/^[\+\/×]|[\+\-\/×]$/);

				calculate(/\d+(?:\.\d+)?[\/×]\d+(?:\.\d+)?/); // multipy and divide pattern
				calculate(/\d+(?:\.\d+)?[\-\+]\d+(?:\.\d+)?/); // plus and minus pattern

				$('#total').text(statement);
			}
		}
	});

});