$(document).ready(function(){

	$(document).on('click',".num",function(){
		if($('#formula').css('display') == 'none')
			reset();

		let val = $(this).data('value');
		$('#formula').append(val);
		let statement = $('#formula').text().trim();

		executeCalc(statement);
	});

	$(document).on('click',".op",function(){
		if($('#formula').css('display') == 'none')
			reset();

		let formula = $('#formula').text().trim();
		let opkey = $(this).data('value');

		if(formula.length > 0){
			let last_char = formula.slice(-1);

			if('+-×/'.includes(last_char) && formula.length > 1){
				formula = formula.slice(0,-1) + opkey;
				$('#formula').text(formula);
			}else if('1234567890'.includes(last_char)){
				$('#formula').append(opkey);
			}
		}else{
			if(opkey == '-')
				$('#formula').append(opkey);
		}

	});

	$(document).on('click','#key-eql', function(){
		let statement = $('#formula').text().trim();

		executeCalc(statement);
		if($('#total').text().trim().length){
			let theme = $('.toggle-btn > .active').data('theme');
			$('.screen').css({'justify-content': 'center','font-size' : '2rem'});
			$('#formula').css({'display': 'none'});
			switch(theme){
				case 1:
					$('#total').css({'color': 'var(--theme1-total-active)'}); break;
				case 2:
					$('#total').css({'color': 'var(--theme2-total-active)'}); break;
				case 3:
					$('#total').css({'color': 'var(--theme3-total-active)'}); break;	
			}
		}
	});


	$(document).on('click',"#key-dot",function(){
		if($('#formula').css('display') == 'none')
			reset();
		
		let dotkey = $(this).data('value');
		$('#formula').append(dotkey);
	});

	$(document).on('click',"#key-res",function(){
		reset();
	});


	let executeCalc = (statement) => {
		$('#total').text(calculate(statement));
	}

	let isValidGeneralPattern = (statement) => {
		let pattern = /^-?(?:\.|(?:\d+\.))?\d+[-\+×\/](?:\.|(?:\d+\.))?\d+/ // general pattern for checking

		return statement.search(pattern) > -1 ? true : false;
	}

	let calculate = (statement) => {
		// cleanup operators placed at the front and end
		statement = statement.replace(/^[\+\/×]|[\+\-\/×\.]$/,'');

		if(isValidGeneralPattern(statement)){
			if(isDivideZeroNotExist()){
				let higher_pattern = /^-?(?:\.|(?:\d+\.))?\d+[×\/](?:\.|(?:\d+\.))?\d+|(?:\.|(?:\d+\.))?\d+[×\/](?:\.|(?:\d+\.))?\d+/
				let lower_pattern = /^-?(?:\.|(?:\d+\.))?\d+[-\+](?:\.|(?:\d+\.))?\d+/

				// calculate for higher pattern first
				while(statement.search(higher_pattern) > -1){
					let [result] = statement.match(higher_pattern);
					let [,operand1, operator, operand2] = getOperandsAndOperator(result);
					let calc_val = compute([operand1, operand2], operator);
					statement = statement.replace(result,calc_val);
				}

				// then calculate for lower pattern
				while(statement.search(lower_pattern) > -1){
					let [result] = statement.match(lower_pattern);
					let [,operand1, operator, operand2] = getOperandsAndOperator(result);
					let calc_val = compute([operand1, operand2], operator);
					statement = statement.replace(result,calc_val);
				}

				statement = isNotDivisibleByZero(statement);

				return statement;
			}
		}	
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


	let getOperandsAndOperator = (formula) => {
		let regEx = /(^-?(?:\.|(?:\d+\.))?\d+)([-\+×\/])((?:\.|(?:\d+\.))?\d+)/g;
		let matches = regEx.exec(formula);

		return matches;
	}

	let isNotDivisibleByZero = (statement) => {
		if(statement.search('Infinity') > -1)
			return 'Not divisible by zero';
		return statement;
	}

	let isDivideZeroNotExist = () => {
		let total = $('#total').text().trim();

		if(total != 'Not divisible by zero')
			return true;
		return false;
	}
	
	let reset = () => {
		$('#formula').empty();
		$('#total').empty();

		let theme = $('.toggle-btn > .active').data('theme');
		$('.screen').css({'justify-content': '','font-size' : '1.3rem'});
		$('#formula').css({'display': 'block'});
		switch(theme){
			case 1:
				$('#total').css({'color': 'var(--theme1-total)'}); break;
			case 2:
				$('#total').css({'color': 'var(--theme2-total)'}); break;
			case 3:
				$('#total').css({'color': 'var(--theme3-total)'}); break;	
		}
	}

});