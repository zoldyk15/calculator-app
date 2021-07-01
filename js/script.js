$(document).ready(function(){

	// Change Theme Events
	$(document).on('click','#theme1',function(){
		$('.toggle-btn > li.active').removeClass('active');
		$(this).addClass('active');

		$('.theme-main-bg').removeClass('theme1 theme2 theme3').addClass('theme1');
		$('.toggle-btn').removeClass('theme1 theme2 theme3').addClass('theme1');
		$('.screen').removeClass('theme1 theme2 theme3').addClass('theme1');
		$('#total').removeClass('theme1 theme2 theme3').addClass('theme1');
		$('.key-grp').removeClass('theme1 theme2 theme3').addClass('theme1');
		$('.num-op-key').removeClass('theme1 theme2 theme3').addClass('theme1');
		$('.special-key').removeClass('theme1 theme2 theme3').addClass('theme1');
		$('.eql-key').removeClass('theme1 theme2 theme3').addClass('theme1');
	});

	$(document).on('click','#theme2',function(){
		$('.toggle-btn > li.active').removeClass('active');
		$(this).addClass('active');

		$('.theme-main-bg').removeClass('theme1 theme2 theme3').addClass('theme2');
		$('.toggle-btn').removeClass('theme1 theme2 theme3').addClass('theme2');
		$('.screen').removeClass('theme1 theme2 theme3').addClass('theme2');
		$('#total').removeClass('theme1 theme2 theme3').addClass('theme2');
		$('.key-grp').removeClass('theme1 theme2 theme3').addClass('theme2');
		$('.num-op-key').removeClass('theme1 theme2 theme3').addClass('theme2');
		$('.special-key').removeClass('theme1 theme2 theme3').addClass('theme2');
		$('.eql-key').removeClass('theme1 theme2 theme3').addClass('theme2');
	});


	$(document).on('click','#theme3',function(){
		$('.toggle-btn > li.active').removeClass('active');
		$(this).addClass('active');

		$('.theme-main-bg').removeClass('theme1 theme2 theme3').addClass('theme3');
		$('.toggle-btn').removeClass('theme1 theme2 theme3').addClass('theme3');
		$('.screen').removeClass('theme1 theme2 theme3').addClass('theme3');
		$('#total').removeClass('theme1 theme2 theme3').addClass('theme3');
		$('.key-grp').removeClass('theme1 theme2 theme3').addClass('theme3');
		$('.num-op-key').removeClass('theme1 theme2 theme3').addClass('theme3');
		$('.special-key').removeClass('theme1 theme2 theme3').addClass('theme3');
		$('.eql-key').removeClass('theme1 theme2 theme3').addClass('theme3');
	});

	// Calculator Events

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

		if(isDoubleOperator(formula, opkey)){
			formula = formula.slice(0,-1) + opkey;
			$('#formula').text(formula);
		}else if(isValidOperator(formula, opkey)){
			$('#formula').append(opkey);
		}
	});

	$(document).on('click','#key-eql', function(){
		let statement = $('#formula').text().trim();

		executeCalc(statement);
		if($('#total').text().trim().length){
			$('.screen').css({'justify-content': 'center','font-size' : '2rem'});
			$('#formula').css({'display': 'none'});
			$('#total').addClass('eql');
		}
	});


	$(document).on('click',"#key-dot",function(){
		if($('#formula').css('display') == 'none')
			reset();
		
		let dotkey = $(this).data('value');
		let formula = $('#formula').text().trim();
		if(isValidDot(formula))
			$('#formula').append(dotkey);
	});

	$(document).on('click',"#key-res",function(){
		reset();
	});

	$(document).on('click','#key-del',function(){
		let formula = $('#formula').text().trim();
		formula = formula.slice(0,-1);

		$('#formula').text(formula);

		if(isValidGeneralPattern(formula))
			executeCalc(formula);
		else
			$('#total').text('');
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

	
	let reset = () => {
		$('#formula').empty();
		$('#total').empty();

		$('.screen').css({'justify-content': '','font-size' : '1.3rem'});
		$('#formula').css({'display': 'block'});
		$('#total').removeClass('eql');
	}

	let isValidDot = (statement) => {
		statement = statement + '.';

		if(statement.search(/\.\.|\d+\.\d+\./) != -1)
			return false;
		return true;
	}

	let isDoubleOperator = (statement, op) => {
		statement = statement + op;

		if(statement.search(/[×\/\+-]{2,}/) > -1)
			return true;
		return false;

	}

	let isValidOperator = (statement, op) => {
		statement = statement + op;

		// if doesn't starts with +, /, x
		if(statement.search(/^[^\+\/×]/) > -1)
			return true;
		return false;
	}


});