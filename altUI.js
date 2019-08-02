/**
 * @author edvilme, inspired from mrdoob's UI.js
 */

var UI = {};

UI.Element = function ( dom ) {

	this.dom = dom;

};

UI.Element.prototype = {

	add: function () {

		for ( var i = 0; i < arguments.length; i ++ ) {

			var argument = arguments[ i ];

			if ( argument instanceof UI.Element ) {

				this.dom.appendChild( argument.dom );

			} else {

				console.error( 'UI.Element:', argument, 'is not an instance of UI.Element.' );

			}

		}

		return this;

	},

	remove: function () {

		for ( var i = 0; i < arguments.length; i ++ ) {

			var argument = arguments[ i ];

			if ( argument instanceof UI.Element ) {

				this.dom.removeChild( argument.dom );

			} else {

				console.error( 'UI.Element:', argument, 'is not an instance of UI.Element.' );

			}

		}

		return this;

	},

	clear: function () {

		while ( this.dom.children.length ) {

			this.dom.removeChild( this.dom.lastChild );

		}

	},

	setId: function ( id ) {

		this.dom.id = id;

		return this;

	},

	setClass: function ( name ) {

		this.dom.className = name;

		return this;

	},

	setStyle: function ( style, array ) {

		for ( var i = 0; i < array.length; i ++ ) {

			this.dom.style[ style ] = array[ i ];

		}

		return this;

	},

	setDisabled: function ( value ) {

		this.dom.disabled = value;

		return this;

	},

	setTextContent: function ( value ) {

		this.dom.textContent = value;

		return this;

	}

};

// properties

var properties = [
	'position', 'left', 'top', 'right', 'bottom', 'width', 'height', 'display', 'overflow',
	'border', 'borderLeft', 'borderTop', 'borderRight', 'borderBottom', 'borderColor',
	'margin', 'marginLeft', 'marginTop', 'marginRight', 'marginBottom',
	'padding', 'paddingLeft', 'paddingTop', 'paddingRight', 'paddingBottom',
	'color', 'background', 'backgroundColor', 'opacity', 'verticalAlign',
	'fontSize', 'fontWeight', 'textAlign', 'textDecoration', 'textTransform', 'cursor', 'zIndex'
];

properties.forEach( function ( property ) {

	var method = 'set' + property.substr( 0, 1 ).toUpperCase() + property.substr( 1, property.length );

	UI.Element.prototype[ method ] = function () {

		this.setStyle( property, arguments );

		return this;

	};

} );

// events

var events = [ 'KeyUp', 'KeyDown', 'MouseOver', 'MouseOut', 'Click', 'DblClick', 'Change' ];

events.forEach( function ( event ) {

	var method = 'on' + event;

	UI.Element.prototype[ method ] = function ( callback ) {

		this.dom.addEventListener( event.toLowerCase(), callback.bind( this ), false );

		return this;

	};

} );

// Span

UI.Span = function () {

	UI.Element.call( this );

	this.dom = document.createElement( 'span' );

	return this;

};

UI.Span.prototype = Object.create( UI.Element.prototype );
UI.Span.prototype.constructor = UI.Span;

// Div

UI.Div = function () {

	UI.Element.call( this );

	this.dom = document.createElement( 'div' );

	return this;

};

UI.Div.prototype = Object.create( UI.Element.prototype );
UI.Div.prototype.constructor = UI.Div;

// Row

UI.Row = function () {

	UI.Element.call( this );

	var dom = document.createElement( 'div' );
	dom.className = 'Row';

	this.dom = dom;

	return this;

};

UI.Row.prototype = Object.create( UI.Element.prototype );
UI.Row.prototype.constructor = UI.Row;

// Panel

UI.Panel = function () {

	UI.Element.call( this );

	var dom = document.createElement( 'div' );
	dom.className = 'Panel';

	this.dom = dom;

	return this;

};

UI.Panel.prototype = Object.create( UI.Element.prototype );
UI.Panel.prototype.constructor = UI.Panel;

// Text

UI.Text = function ( text ) {

	UI.Element.call( this );

	this.dom = document.createElement( 'span' );
	this.dom.classList.add('altUI_Text');
	this.setValue( text );
	return this;

};

UI.Text.prototype = Object.create( UI.Element.prototype );
UI.Text.prototype.constructor = UI.Text;

UI.Text.prototype.getValue = function () {
	return this.dom.textContent;
};

UI.Text.prototype.setValue = function ( value ) {
	if ( value !== undefined ) {
		this.dom.textContent = value;
	}
	return this;
};


// Input

UI.InputView = function (hint, value, name, type) {

	UI.Element.call( this );

	var scope = this;

	this.dom = document.createElement('div');
	this.dom.classList.add('altUI_InputView');
	
	let hintText = document.createElement('label');
	//hintText.for=name;
	hintText.classList.add('altUI_InputViewHint');
	hintText.textContent = hint;
	
	
	this.input = document.createElement( 'input' );
	this.input.type = type;			
	
	
	this.input.classList.add('altUI_InputViewInput');
	this.input.name = name;
	this.input.value = value;
	this.input.addEventListener( 'keydown', function ( event ) {
		event.stopPropagation();
	}, false );

	this.dom.append(hintText);
	this.dom.append(this.input);
	
	if(value == undefined || value == ''){
		if(type=='date'){
			this.input.value = new Date().toISOString().split('T')[0]
		}
	}
	if(type=='checkbox'){
		this.input.checked = value;
	}

	return this;

};

UI.InputView.prototype = Object.create( UI.Element.prototype );
UI.InputView.prototype.constructor = UI.InputView;

UI.InputView.prototype.getValue = function () {
	return this.input.value;
};

UI.InputView.prototype.setValue = function ( value ) {
 	this.input.value = value;
	return this;
};
UI.InputView.prototype.hor = function(){
	this.dom.style.flexDirection = 'row';
	this.dom.style.alignItems = 'center';
	return this;
}
UI.InputView.prototype.nocheck = function(){
	this.input.setAttribute('check-form', 'false');
	return this;
}

// TextArea

UI.TextArea = function () {

	UI.Element.call( this );

	var scope = this;

	var dom = document.createElement( 'textarea' );
	dom.className = 'TextArea';
	dom.style.padding = '2px';
	dom.spellcheck = false;

	dom.addEventListener( 'keydown', function ( event ) {

		event.stopPropagation();

		if ( event.keyCode === 9 ) {

			event.preventDefault();

			var cursor = dom.selectionStart;

			dom.value = dom.value.substring( 0, cursor ) + '\t' + dom.value.substring( cursor );
			dom.selectionStart = cursor + 1;
			dom.selectionEnd = dom.selectionStart;

		}

	}, false );

	this.dom = dom;

	return this;

};

UI.TextArea.prototype = Object.create( UI.Element.prototype );
UI.TextArea.prototype.constructor = UI.TextArea;

UI.TextArea.prototype.getValue = function () {

	return this.dom.value;

};

UI.TextArea.prototype.setValue = function ( value ) {

	this.dom.value = value;

	return this;

};


// Select

UI.Select = function (hint, value, name) {

	UI.Element.call( this );

	var scope = this;

	this.dom = document.createElement('div');
	this.dom.classList.add('altUI_InputView');
	
	let hintText = document.createElement('label');
	//hintText.for=name;
	hintText.classList.add('altUI_InputViewHint');
	hintText.textContent = hint;
	
	this.input = document.createElement( 'select' );
	this.input.classList.add('altUI_InputViewInput');
	this.input.classList.add('altUI_InputSelect');
	this.input.name = name;
	
	this.dom.append(hintText);
	this.dom.append(this.input);
	this.setValue(value);

	return this;

};

UI.Select.prototype = Object.create( UI.Element.prototype );
UI.Select.prototype.constructor = UI.Select;

UI.Select.prototype.setMultiple = function ( boolean ) {

	this.input.multiple = boolean;

	return this;

};

UI.Select.prototype.setOptions = function ( options ) {

	var selected = this.input.value;

	while ( this.input.children.length > 0 ) {

		this.input.removeChild( this.input.firstChild );

	}

	for ( var key in options ) {

		var option = document.createElement( 'option' );
		option.value = key;
		option.innerHTML = options[ key ];
		this.input.appendChild( option );

	}

	this.input.value = selected;

	return this;

};

UI.Select.prototype.getValue = function () {

	return this.input.value;

};

UI.Select.prototype.setValue = function ( value ) {

	value = String( value );

	if ( this.input.value !== value ) {

		this.input.value = value;

	}

	return this;

};

UI.Select.prototype.hor = function (){
	this.dom.style.flexDirection = 'row';
	this.dom.style.alignItems = 'center';
	return this;
}

// Checkbox

UI.Checkbox = function ( boolean ) {

	UI.Element.call( this );

	var scope = this;

	var dom = document.createElement( 'input' );
	dom.className = 'Checkbox';
	dom.type = 'checkbox';

	this.dom = dom;
	this.setValue( boolean );

	return this;

};

UI.Checkbox.prototype = Object.create( UI.Element.prototype );
UI.Checkbox.prototype.constructor = UI.Checkbox;

UI.Checkbox.prototype.getValue = function () {

	return this.dom.checked;

};

UI.Checkbox.prototype.setValue = function ( value ) {

	if ( value !== undefined ) {

		this.dom.checked = value;

	}

	return this;

};


// Color

UI.Color = function (value, icon=false) {
	UI.Element.call( this );
	var scope = this;
	this.textContent = value;
	this.dom = document.createElement( 'div' );
	this.dom.classList.add('altUI_Color')
	this.dom.textContent = this.textContent;
	if(icon){this.dom.classList.add('material-icons')};
	this.colorInput = document.createElement('input');
	this.colorInput.type='color';
	this.value = this.colorInput.value;
	this.dom.append(this.colorInput)
	
	this.dom.addEventListener('click', function(){
		scope.colorInput.click();
	})
	this.colorInput.addEventListener('change', function(){
		scope.dom.style.color = scope.colorInput.value;
		scope.value = scope.colorInput.value;
	})
	return this;

};

UI.Color.prototype = Object.create( UI.Element.prototype );
UI.Color.prototype.constructor = UI.Color;

UI.Color.prototype.getValue = function () {
	return this.value;
};

UI.Color.prototype.getHexValue = function () {

	return parseInt( this.value.substr( 1 ), 16 );

};

UI.Color.prototype.setValue = function ( hex ) {
	this.colorInput.value =  '#' + ( '000000' + hex.toString( 16 ) ).slice( - 6 );
	this.value =  '#' + ( '000000' + hex.toString( 16 ) ).slice( - 6 );
	this.dom.innerHTML = '';
	this.dom.textContent = this.textContent;
	this.dom.append(this.colorInput);
	this.dom.style.color = hex;
	return this;

};

UI.Color.prototype.setHexValue = function ( hex ) {
	this.colorInput.value =  '#' + ( '000000' + hex.toString( 16 ) ).slice( - 6 );
	this.value = '#' + ( '000000' + hex.toString( 16 ) ).slice( - 6 );
	this.dom.innerHTML = '';
	this.dom.textContent = this.textContent;
	this.dom.append(this.colorInput);
	this.dom.style.color = value;
	return this;
	return this;

};


// Number

UI.Number = function ( number ) {

	UI.Element.call( this );

	var scope = this;

	var dom = document.createElement( 'input' );
	dom.className = 'Number';
	dom.value = '0.00';

	dom.addEventListener( 'keydown', function ( event ) {

		event.stopPropagation();

		if ( event.keyCode === 13 ) dom.blur();

	}, false );

	this.value = 0;

	this.min = - Infinity;
	this.max = Infinity;

	this.precision = 2;
	this.step = 1;
	this.unit = '';

	this.dom = dom;

	this.setValue( number );

	var changeEvent = document.createEvent( 'HTMLEvents' );
	changeEvent.initEvent( 'change', true, true );

	var distance = 0;
	var onMouseDownValue = 0;

	var pointer = [ 0, 0 ];
	var prevPointer = [ 0, 0 ];

	function onMouseDown( event ) {

		event.preventDefault();

		distance = 0;

		onMouseDownValue = scope.value;

		prevPointer = [ event.clientX, event.clientY ];

		document.addEventListener( 'mousemove', onMouseMove, false );
		document.addEventListener( 'mouseup', onMouseUp, false );

	}

	function onMouseMove( event ) {

		var currentValue = scope.value;

		pointer = [ event.clientX, event.clientY ];

		distance += ( pointer[ 0 ] - prevPointer[ 0 ] ) - ( pointer[ 1 ] - prevPointer[ 1 ] );

		var value = onMouseDownValue + ( distance / ( event.shiftKey ? 5 : 50 ) ) * scope.step;
		value = Math.min( scope.max, Math.max( scope.min, value ) );

		if ( currentValue !== value ) {

			scope.setValue( value );
			dom.dispatchEvent( changeEvent );

		}

		prevPointer = [ event.clientX, event.clientY ];

	}

	function onMouseUp( event ) {

		document.removeEventListener( 'mousemove', onMouseMove, false );
		document.removeEventListener( 'mouseup', onMouseUp, false );

		if ( Math.abs( distance ) < 2 ) {

			dom.focus();
			dom.select();

		}

	}

	function onChange( event ) {

		scope.setValue( dom.value );

	}

	function onFocus( event ) {

		dom.style.backgroundColor = '';
		dom.style.cursor = '';

	}

	function onBlur( event ) {

		dom.style.backgroundColor = 'transparent';
		dom.style.cursor = 'col-resize';

	}

	onBlur();

	dom.addEventListener( 'mousedown', onMouseDown, false );
	dom.addEventListener( 'change', onChange, false );
	dom.addEventListener( 'focus', onFocus, false );
	dom.addEventListener( 'blur', onBlur, false );

	return this;

};

UI.Number.prototype = Object.create( UI.Element.prototype );
UI.Number.prototype.constructor = UI.Number;

UI.Number.prototype.getValue = function () {

	return this.value;

};

UI.Number.prototype.setValue = function ( value ) {

	if ( value !== undefined ) {

		value = parseFloat( value );

		if ( value < this.min ) value = this.min;
		if ( value > this.max ) value = this.max;

		this.value = value;
		this.dom.value = value.toFixed( this.precision );

		if ( this.unit !== '' ) this.dom.value += ' ' + this.unit;

	}

	return this;

};

UI.Number.prototype.setPrecision = function ( precision ) {

	this.precision = precision;

	return this;

};

UI.Number.prototype.setStep = function ( step ) {

	this.step = step;

	return this;

};

UI.Number.prototype.setRange = function ( min, max ) {

	this.min = min;
	this.max = max;

	return this;

};

UI.Number.prototype.setUnit = function ( unit ) {

	this.unit = unit;

	return this;

};

// Integer

UI.Integer = function ( number ) {

	UI.Element.call( this );

	var scope = this;

	var dom = document.createElement( 'input' );
	dom.className = 'Number';
	dom.value = '0';

	dom.addEventListener( 'keydown', function ( event ) {

		event.stopPropagation();

	}, false );

	this.value = 0;

	this.min = - Infinity;
	this.max = Infinity;

	this.step = 1;

	this.dom = dom;

	this.setValue( number );

	var changeEvent = document.createEvent( 'HTMLEvents' );
	changeEvent.initEvent( 'change', true, true );

	var distance = 0;
	var onMouseDownValue = 0;

	var pointer = [ 0, 0 ];
	var prevPointer = [ 0, 0 ];

	function onMouseDown( event ) {

		event.preventDefault();

		distance = 0;

		onMouseDownValue = scope.value;

		prevPointer = [ event.clientX, event.clientY ];

		document.addEventListener( 'mousemove', onMouseMove, false );
		document.addEventListener( 'mouseup', onMouseUp, false );

	}

	function onMouseMove( event ) {

		var currentValue = scope.value;

		pointer = [ event.clientX, event.clientY ];

		distance += ( pointer[ 0 ] - prevPointer[ 0 ] ) - ( pointer[ 1 ] - prevPointer[ 1 ] );

		var value = onMouseDownValue + ( distance / ( event.shiftKey ? 5 : 50 ) ) * scope.step;
		value = Math.min( scope.max, Math.max( scope.min, value ) ) | 0;

		if ( currentValue !== value ) {

			scope.setValue( value );
			dom.dispatchEvent( changeEvent );

		}

		prevPointer = [ event.clientX, event.clientY ];

	}

	function onMouseUp( event ) {

		document.removeEventListener( 'mousemove', onMouseMove, false );
		document.removeEventListener( 'mouseup', onMouseUp, false );

		if ( Math.abs( distance ) < 2 ) {

			dom.focus();
			dom.select();

		}

	}

	function onChange( event ) {

		scope.setValue( dom.value );

	}

	function onFocus( event ) {

		dom.style.backgroundColor = '';
		dom.style.cursor = '';

	}

	function onBlur( event ) {

		dom.style.backgroundColor = 'transparent';
		dom.style.cursor = 'col-resize';

	}

	onBlur();

	dom.addEventListener( 'mousedown', onMouseDown, false );
	dom.addEventListener( 'change', onChange, false );
	dom.addEventListener( 'focus', onFocus, false );
	dom.addEventListener( 'blur', onBlur, false );

	return this;

};

UI.Integer.prototype = Object.create( UI.Element.prototype );
UI.Integer.prototype.constructor = UI.Integer;

UI.Integer.prototype.getValue = function () {

	return this.value;

};

UI.Integer.prototype.setValue = function ( value ) {

	if ( value !== undefined ) {

		value = parseInt( value );

		this.value = value;
		this.dom.value = value;

	}

	return this;

};

UI.Integer.prototype.setStep = function ( step ) {

	this.step = parseInt( step );

	return this;

};

UI.Integer.prototype.setRange = function ( min, max ) {

	this.min = min;
	this.max = max;

	return this;

};


// Break

UI.Break = function () {

	UI.Element.call( this );

	var dom = document.createElement( 'br' );
	dom.className = 'Break';

	this.dom = dom;

	return this;

};

UI.Break.prototype = Object.create( UI.Element.prototype );
UI.Break.prototype.constructor = UI.Break;


// HorizontalRule

UI.HorizontalRule = function () {

	UI.Element.call( this );

	this.dom = document.createElement( 'hr' );
	this.dom.classList.add('altUI_HorizontalRule');
	
	return this;

};

UI.HorizontalRule.prototype = Object.create( UI.Element.prototype );
UI.HorizontalRule.prototype.constructor = UI.HorizontalRule;


// Button

UI.Button = function ( value, icon, hintPadding ) {

	UI.Element.call( this );

	this.dom = document.createElement( 'button' );
        this.dom.type="button";
	this.dom.classList.add('altUI_Button');
	if(value){
		this.dom.textContent = value;
	}
	if(icon){
		this.dom.classList.add('material-icons')
	}
	return this;

};

UI.Button.prototype = Object.create( UI.Element.prototype );
UI.Button.prototype.constructor = UI.Button;

UI.Button.prototype.setLabel = function ( value ) {
	this.dom.textContent = value;
	return this;
};
UI.Button.prototype.blue = function(){
	this.dom.style.backgroundColor = 'rgb(0,122,255)';
	this.dom.style.color = 'rgb(255,255,255)';
	return this;
}
UI.Button.prototype.gray = function(){
	this.dom.style.backgroundColor ='rgb(142,142,147)';
	this.dom.style.color = 'rgb(255,255,255)';
	return this;
}
UI.Button.prototype.green = function(){
	this.dom.style.backgroundColor = 'rgb(52,199,89)';
	this.dom.style.color = 'rgb(255,255,255)';
	return this;
}
UI.Button.prototype.indigo = function(){
	this.dom.style.backgroundColor = 'rgb(88,86,214)';
	this.dom.style.color = 'rgb(255,255,255)';
	return this;
}
UI.Button.prototype.orange = function(){
	this.dom.style.backgroundColor = 'rgb(255,149,0)';
	this.dom.style.color = 'rgb(255,255,255)';
	return this;
}
UI.Button.prototype.pink = function(){
	this.dom.style.backgroundColor = 'rgb(255,45,85)';
	this.dom.style.color = 'rgb(255,255,255)';
	return this;
}
UI.Button.prototype.purple = function(){
	this.dom.style.backgroundColor = 'rgb(175,82,22)';
	this.dom.style.color = 'rgb(255,255,255)';
	return this;
}
UI.Button.prototype.red = function(){
	this.dom.style.backgroundColor = 'rgb(255,59,48)';
	this.dom.style.color = 'rgb(255,255,255)';
	return this;
}
UI.Button.prototype.teal = function(){
	this.dom.style.backgroundColor = 'rgb(90,200,250)';
	this.dom.style.color = 'rgb(255,255,255)';
	return this;
}
UI.Button.prototype.yellow = function(){
	this.dom.style.backgroundColor = 'rgb(255,204,0)';
	this.dom.style.color = 'rgb(255,255,255)';
	return this;
}
UI.Button.prototype.transparent = function(textColor){
	this.dom.style.backgroundColor = 'transparent';
	this.dom.style.color = textColor;
	return this;
}



// Modal

UI.Modal = function ( value ) {

	var scope = this;
	this.actionRequired = false;
	this.dom = document.createElement( 'div' );
	this.dom.style.position = 'absolute';
	this.dom.style.width = '100%';
	this.dom.style.height = '100%';
	this.dom.style.backgroundColor = 'rgba(0,0,0,0.5)';
	this.dom.style.display = 'none';
	this.dom.style.overflow = 'auto';
	this.dom.style.justifyContent = 'center';
	this.dom.style.backdropFilter = 'blur(8px)';
	this.dom.style.boxSizing = 'border-box';
	this.dom.style.paddingTop = '40px';
	this.dom.style.zIndex = '1000';
	//this.dom.style.alignItems = 'flex-end';
	this.dom.addEventListener( 'click', function ( e ) {
		if(!scope.actionRequired && !document.querySelector(':focus')){
			scope.hide();
		}
		e.stopPropagation();
		e.stopImmediatePropagation();
	} );
	this.container = document.createElement('div');
	this.container.classList.add('altUI_Modal');
	
	this.titleBar = document.createElement('div');
	this.titleBar.classList.add('altUI_ModalTitle');
	if(this.actionRequired){
		this.titleBar.classList.add('altUI_ModalTitleFull');
		this.titleBar.prepend(this.backButton);
	}
	this.backButton = document.createElement('div');
		this.backButton.classList.add('altUI_ModalTitleEsc');
		this.backButton.classList.add('material-icons');
		this.backButton.innerText = 'arrow_back_ios';
		this.backButton.addEventListener('click', function(e){
			scope.hide()
		})
		
	
	
	this.content = document.createElement('div');
	this.content.classList.add('altUI_ModalContent')
	this.container.addEventListener('click', function(e){
		e.stopImmediatePropagation();
		e.stopPropagation();
	})
	this.container.append(this.titleBar, this.content);
	this.dom.append( this.container );

	return this;

};

UI.Modal.prototype = Object.create( UI.Element.prototype );
UI.Modal.prototype.constructor = UI.Modal;

UI.Modal.prototype.show = function ( content, newTitle ) {
	this.content.innerHTML = "";
	this.content.append( content );
	this.titleBar.innerText = newTitle;
	this.dom.style.display = 'flex';
	if(this.actionRequired){
		this.titleBar.prepend(this.backButton);
	}
	return this;
};

UI.Modal.prototype.hide = function () {
	this.dom.style.display = 'none';
	this.actionRequired = false;
	this.container.classList.remove('altUI_ModalFull');
	return this;
};
UI.Modal.prototype.setTitle = function (newTitle){
	this.titleBar.innerText = newTitle;
	if(this.actionRequired){
		this.titleBar.prepend(this.backButton);
	}
	return this;
}
UI.Modal.prototype.requireAction = function(){
	this.actionRequired = true;
	this.container.classList.add('altUI_ModalFull');
	return this;
}

//
UI.AppBar = function(logo, toolbar){
  UI.Element.call( this );

	this.dom = document.createElement( 'div' );
	this.dom.classList.add('altUI_AppBar');

	this.leftNav = document.createElement('div')
	this.dom.append(this.leftNav)
	let AppBarTop = document.createElement('div');
	AppBarTop.classList.add('altUI_AppBarTop');

	this.AppBarLogo = document.createElement('img');
	this.AppBarLogo.classList.add('altUI_AppBarLogo');
  	this.AppBarLogo.src = logo;

  	AppBarTop.append(this.AppBarLogo);
  	this.dom.append(AppBarTop);

  	this.AppBarToolbar =  document.createElement( 'div' );
  	this.AppBarToolbar.classList.add('altUI_AppBarToolbar');
	this.AppBarToolbar.innerHTML = "<h1></h1>"
	
	if(toolbar.split !=undefined){
		this.addToolbarItem(toolbar)
	}else if( toolbar.length>0 ){
		toolbar.forEach(function(l){
			this.addToolbarItem(l)
		})
	}
	
	
	
	//AppBarToolbar.append(toolbar);
	
	this.dom.append(this.AppBarToolbar)
  
	return this;
}

UI.AppBar.prototype = Object.create(UI.Element.prototype);
UI.AppBar.prototype.constructor = UI.AppBar;
UI.AppBar.prototype.showBackButton = function(callback){
	let AppBarBack = document.createElement('div');
  	AppBarBack.classList.add('altUI_AppBarBack');
  	AppBarBack.innerHTML = "<i class='material-icons'>arrow_back</i>"
  	this.dom.querySelector(".altUI_AppBarToolbar").prepend(AppBarBack)
  	return this;
}
UI.AppBar.prototype.setTitle = function(title){
	this.AppBarToolbar.querySelector("h1").textContent = title;
	return this;
}
UI.AppBar.prototype.setLogo = function(imageURL){
	this.AppBarLogo.src = imageURL;
	return this;
}
UI.AppBar.prototype.setBackButton = function(content){
	this.leftNav.innerHTML="";
	this.leftNav.append(content);
	return this;
}
UI.AppBar.prototype.addToolbarItem = function(item){
	this.AppBarToolbar.append(item);
	return this;
}

UI.AppBar.prototype.set = function(options){
	let scope = this;
	if(options.title!=undefined){
		this.title = options.title;
		this.dom.querySelector(".altUI_AppBarToolbar").querySelector("h1").textContent = options.title;
	}
	if(options.logo!=undefined){
		this.AppBarLogo.src = options.logo;
	}
	if(options.backButton!=undefined){
		this.leftNav.innerHTML="";
		this.leftNav.append(options.backButton);
	}
	if(options.toolbar!=undefined){
		this.AppBarToolbar.innerHTML = '<h1></h1>';
		this.set({title: this.title});
		options.toolbar.forEach(function(i){
			if(i!=undefined){
				scope.AppBarToolbar.append(i);
			}
		})
	}
	return this;
}



UI.TabView = function(){
	UI.Element.call(this);
	
	this.views = [];
	
	this.dom = document.createElement('div');
	this.dom.classList.add('altUI_TabView');
	let tabs = document.createElement('div');
	tabs.classList.add('altUI_TabViewTabs');
	
	this.viewsContainer = document.createElement('div');
	this.viewsContainer.classList.add('altUI_TabViewViews');
	
	this.dom.append(tabs);
	this.dom.append(this.viewsContainer)
	return this;
}
UI.TabView.prototype = Object.create(UI.Element.prototype);
UI.TabView.prototype.constructor = UI.TabView;
UI.TabView.prototype.addTab = function(i, label, content, iconName=''){
	
	content.classList.add('altUI_TabViewContent');
	content.id = "altUI_TabViewContent_"+i;
	this.views.push(content)
	
	let scope = this;
	let TabLabel = document.createElement('div');
	TabLabel.classList.add('altUI_TabViewTab');
	TabLabel.textContent = label;
	TabLabel.id = "altUI_TabViewTab_"+i;
	let icon = document.createElement('i');
	icon.classList.add('material-icons');
	icon.textContent = iconName;
	TabLabel.prepend(icon)
	
	
	
	this.dom.querySelector('.altUI_TabViewTabs').append(TabLabel);
	this.dom.querySelector('.altUI_TabViewViews').append(content);
	TabLabel.addEventListener('click', function(){
		scope.setTab( scope.views.indexOf(content) )
	});
	//this.setTab(0);
	return this;
}
UI.TabView.prototype.setTab = function(i=0, callback=function(){}){
	
	/*this.dom.querySelector('.altUI_TabViewViews').querySelectorAll('.altUI_TabViewContent').forEach(function(l){
		l.classList.remove('altUI_TabViewContentActive')
	})
	this.dom.querySelector('.altUI_TabViewViews').querySelector("#altUI_TabViewContent_"+i).classList.add('altUI_TabViewContentActive')
	*/
	this.viewsContainer.innerHTML = '';
	this.viewsContainer.append(  this.views[i] )
	this.dom.querySelector('.altUI_TabViewTabs').querySelectorAll('.altUI_TabViewTab').forEach(function(l){
		l.classList.remove('altUI_TabViewTabActive')
	})
	this.dom.querySelector('.altUI_TabViewTabs').querySelector("#altUI_TabViewTab_"+i).classList.add('altUI_TabViewTabActive');
	callback();
	return this;
}

UI.CellViewItemKeyValue = function( topText = '', bottomText = '' ){
	UI.Element.call(this);
	this.dom = document.createElement('div');
	this.dom.classList.add('altUI_CellViewItem');
	this.dom.classList.add('altUI_CellViewItemKeyValue');
	this.keyElement = document.createElement('div');
	this.keyElement.classList.add('altUI_CellViewItemKeyValue_Key')
	this.keyElement.append(topText);
	this.valueElement = document.createElement('div');
	this.valueElement.classList.add('altUI_CellViewItemKeyValue_Value');
	this.valueElement.append(bottomText);
	this.dom.append(this.keyElement);
	this.dom.append(this.valueElement);
	return this
}

UI.CellViewItemKeyValue.prototype = Object.create(UI.Element.prototype);
UI.CellViewItemKeyValue.prototype.constructor = UI.CellViewItemKeyValue;

UI.ListViewItemKeyValue = function( leftText="", rightText ){
	UI.Element.call(this);
	this.dom = document.createElement('div');
	this.dom.classList.add('altUI_ListViewItem');
	this.dom.classList.add('altUI_ListViewItemKeyValue');
	this.dom.style.overflow="hidden";
	this.leftElement = document.createElement('div');
	this.leftElement.classList.add('altUI_ListViewItemKeyValue_Key');
	this.leftElement.append(leftText)
	this.rightElement = document.createElement('div');
	this.rightElement.classList.add('altUI_ListViewItemKeyValue_Value');
	this.rightElement.append(rightText);
	this.dom.append(this.leftElement);
	this.dom.append(this.rightElement);
	return this;
}

UI.ListViewItemKeyValue.prototype = Object.create(UI.Element.prototype);
UI.ListViewItemKeyValue.prototype.constructor = UI.ListViewItemKeyValue;

UI.ListViewItemMaster = function(
	leftElement=document.createElement('div'), 
	textLabel='', detailTextLabel='', 
	rightElement=document.createElement('div'),
){
	UI.Element.call(this);
	this.dom = document.createElement('div');
	this.dom.classList.add('altUI_ListViewItem');
	this.dom.classList.add('altUI_ListViewItemMaster');
	this.dom.style.overflow='hidden';
	if(leftElement!=null){
		leftElement.style.width = '1em';
		leftElement.style.height = '1em';
		leftElement.style.marginRight = '8px';
		leftElement.style.marginLeft = '8px';
		leftElement.style.fontSize = '4em';
		leftElement.classList.add('altUI_ListViewItemLeft')
		this.dom.append(leftElement);
	}
	let textContainer = document.createElement('div');
	textContainer.classList.add('altUI_ListViewItemCenter');
	textContainer.innerHTML = `<span class="altUI_ListViewItemLabel">${textLabel}</span><span class="altUI_ListViewItemDetail">${detailTextLabel}</span>`
	textContainer.style.marginLeft='8px';
	this.dom.append(textContainer);
	if(rightElement!=null){
		rightElement.style.width = '1.5em';
		rightElement.style.height = '1.5em';
		rightElement.style.marginLeft = '8px';
		rightElement.classList.add('altUI_ListViewItemRight');
		this.dom.append(rightElement);
	}
	return this;
}
UI.ListViewItemMaster.prototype = Object.create(UI.Element.prototype);
UI.ListViewItemMaster.prototype.constructor = UI.ListViewItemMaster;
UI.ListViewItemMaster.prototype.makeCard = function(){
	this.dom.classList.add('altUI_ListViewItemCard');
	return this;
}
UI.Heading = function(level, value){
	UI.Element.call(this);
	this.dom = document.createElement('span');
	this.dom.classList.add('altUI_Heading');
	this.dom.classList.add('altUI_Heading'+level);
	this.dom.innerText = value;
	return this;
}
UI.Heading.prototype = Object.create(UI.Element.prototype);
UI.Heading.prototype.constructor = UI.Heading;


UI.MasterDetailView = function(sections=[], options={
	stackNavigator: null, 
}){
	UI.Element.call(this);
	this.sections = sections;
	this.options = options;
	this.dom = document.createElement('div');
	this.dom.classList.add('altUI_AppView');
	let scope = this;
	this.sidebar = document.createElement('div');
	this.sidebar.classList.add('altUI_AppViewSidebar');
	
	//this.detailView = document.createElement('div')
	/*this.detailView = document.createElement('div');
	this.detailView.classList.add('altUI_AppView_Content');*/
	this.dom.append(this.sidebar);
	//this.dom.append(this.detailView);
	
	this.sections.forEach(function(l){
		scope.addSection(l)
	})
	
	this.sideBarBttn = new UI.Button('arrow_back_ios', 'icon').transparent('rgb(0,122,255)');
		this.sideBarBttn.dom.classList.add('altUI_SidebarBttn')
		this.sideBarBttn.dom.style.padding="4px";
		this.sideBarBttn.dom.addEventListener('click', function(){
			scope.showSidebar();
		})
	if(this.options.stackNavigator != null){
		this.options.stackNavigator.updateDefaultOptions({appBarBackButton: this.sideBarBttn.dom})
	}
	this.hideSidebar();
	return this;
}
UI.MasterDetailView.prototype = Object.create(UI.Element.prototype);
UI.MasterDetailView.prototype.constructor = UI.MasterDetailView;
UI.MasterDetailView.prototype.addSection = function(obj={
	sectionItem: new UI.ListViewItemMaster(null, 'Section', null).dom,
	sectionContent: document.createElement('div'),
	sectionName: '',
	appBarToolbar: [undefined]
}){
	let scope = this;
	this.sections.push(obj);
	obj.sectionItem.classList.add('altUI_AppViewSidebar_item');
	obj.sectionContent.classList.add('altUI_AppView_Content');
	obj.sectionContent.style.width = '100%';
	obj.sectionContent.style.height = '100%';
	obj.sectionContent.style.padding = '8px';
	
	if(obj.sectionItemStyle!=undefined){
		for(var k in obj.sectionItemStyle){
			obj.sectionItem.style[k]=obj.sectionItemStyle[k]
		}
	}
	obj.sectionItem.addEventListener('click', function(){
		scope.setSection(obj.sectionName)
		
	})
	this.sidebar.append(obj.sectionItem)
	return this;
}
UI.MasterDetailView.prototype.hideSidebar = function(){
	if(window.innerWidth < 800){
		this.sidebar.classList.add('altUI_AppViewSidebarHidden')
	}
	return this;
}

UI.MasterDetailView.prototype.showSidebar = function(){
	if(window.innerWidth < 800){
		this.sidebar.classList.remove('altUI_AppViewSidebarHidden')
	}
	return this;
}
UI.MasterDetailView.prototype.setSection = function(sectionName){
	let obj = this.sections.find(function(i){return i.sectionName == sectionName});
	this.sections.forEach(function(i){
			i.sectionItem.style.background = 'transparent'
		})
	obj.sectionItem.style.background = 'rgb(200,200,200)'; 
	
	this.detailView = obj.sectionContent;
	//this.detailView.append(obj.sectionContent);
	this.options.stackNavigator.updateDefaultOptions({
		appBarTitle: obj.sectionName,
		appBarToolbar: obj.appBarToolbar != undefined ? obj.appBarToolbar : [undefined]
	})
	this.dom.innerHTML = '';
	this.dom.append(this.sidebar);
	this.dom.append(this.detailView);
	this.hideSidebar()
	return this;
}
UI.StackNavigator = function(initialContent, appBar, defaultOptions={
	appBarTitle: '',
	appBarLogo: '',
	appBarBackButton: '',
	appBarToolbar: [undefined]
}){
	this.defaultOptions = defaultOptions
	let scope = this;
	this.stacks = [];
	this.appBar = appBar;
	this.dom = document.createElement('div');
	this.dom.classList.add('altUI_AppView_Content');
	this.dom.append(initialContent);
	this.stacks.forEach(function(l,i){
		scope.appendStack(l.content)
	});
	//return this;
	this.appBar.set({
		title: this.defaultOptions.appBarTitle,
		logo: this.defaultOptions.appBarLogo,
		backButton: this.defaultOptions.appBarBackButton,
		toolbar: this.defaultOptions.appBarToolbar
	})
	
	return this;
}
UI.StackNavigator.prototype = Object.create(UI.Element.prototype);
UI.StackNavigator.prototype.constructor = UI.StackNavigator;
UI.StackNavigator.prototype.appendStack = function(content, options = {
	appBarTitle: '',
	appBarLogo: '', 
	appBarToolbar: this.defaultOptions.appBarToolbar
}){
	let scope = this;
	this.stacks.push({content: content, options: options});
	let backdropListener = document.createElement('div');
	let backdrop = document.createElement('div');
		backdrop.classList.add('alUI_StackNavigatorStackCont')
		backdropListener.style.paddingLeft=this.stacks.length*5+'ch';
		
		backdropListener.addEventListener('click', function(e){
			e.stopPropagation();
			if(!document.querySelector(':focus')){
				scope.goBack()
			}
			return true;
		})
	
	content.classList.add('altUI_AppView_Content');
	content.style.boxShadow = '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);'
	/*content.addEventListener('click', function(e){
		e.stopImmediatePropagation();
		e.stopPropagation();
	})*/
	backdrop.append(backdropListener)
	backdrop.append(content);
	this.dom.append(backdrop);
	if(this.appBar != undefined){
		let backButton = new UI.Button('arrow_back_ios', 'icon').transparent('rgb(0,122,255)');
		    backButton.dom.style.padding="4px";
		this.appBar.set({backButton: backButton.dom})
		backButton.dom.addEventListener('click', function(){
			scope.goBack();
		})
	}
	this.appBar.set({ 
		title: options.appBarTitle,
		logo: options.appBarLogo,
		toolbar: options.appBarToolbar
	})
	return this;
}
UI.StackNavigator.prototype.goBack = function(){
	console.log(this.dom)
	if(this.stacks.length > 0){
		this.stacks.pop();
		this.dom.lastElementChild.remove();
		if(this.stacks.length != 0){
			this.appBar.set({
				title: this.stacks[this.stacks.length-1].options.appBarTitle,
				logo: this.stacks[this.stacks.length-1].options.appBarLogo,
				toolbar: this.stacks[this.stacks.length-1].options.appBarToolbar
			})
		}
			//this.appBar.setTitle( this.stacks[this.stacks.length-1].options.appBarTitle )	
			//this.appBar.setLogo( this.stacks[this.stacks.length-1].options.appBarLogo )	
	}
	if(this.stacks.length < 1){
		this.appBar.set({
			backButton: this.defaultOptions.appBarBackButton,
			logo: this.defaultOptions.appBarLogo, 
			title: this.defaultOptions.appBarTitle,
			toolbar: this.defaultOptions.appBarToolbar
		})

	}
	return this;
}

UI.StackNavigator.prototype.updateDefaultOptions = function(defaultOptions={}){
	for(let key in defaultOptions){
		this.defaultOptions[key] = defaultOptions[key]
	}
	this.appBar.set({
		title: this.defaultOptions.appBarTitle,
		logo: this.defaultOptions.appBarLogo,
		backButton: this.defaultOptions.appBarBackButton,
		toolbar: this.defaultOptions.appBarToolbar
	})
	return this;
}


UI.SegmentedControl = function(options, name, callback=function(){}){
	this.options = options;
	this.checked = 1;
	let scope=this;
	UI.Element.call(this);
	this.dom = document.createElement('div');
	this.dom.classList.add('altUI_SegmentedControl');
	this.options.forEach(function(l,i){
		let label = document.createElement('label');
		label.innerText = l;
		label.htmlFor = "_altUI_SegmentedControl-"+name+"_Option-"+i;
		label.classList.add('altUI_SegmentedControl_Option')
		let input = document.createElement('input');
		input.type = 'radio';
		input.value = l;
		input.name = name;
		input.id = "_altUI_SegmentedControl-"+name+"_Option-"+i;
		scope.dom.append(input);
		scope.dom.append(label);
		input.addEventListener('change', function(){ callback(i); scope.checked=i })
	})
	//this.dom.innerText="altUI_SegmentedControl"
	return this;
}
UI.SegmentedControl.prototype = Object.create(UI.Element.prototype);
UI.SegmentedControl.prototype.constructor = UI.SegmentedControl;
UI.SegmentedControl.prototype.setSelection = function(index){
	if(index<this.options.length){
		this.dom.querySelectorAll('input[type="radio"]')[index].checked=true;
		this.checked=index;
	}
	return this;
}

UI.Container = function(contents, options={
	itemStyle: {},
	style: {},
}){
	let scope = this;
	UI.Element.call(this)
	this.dom = document.createElement('div');
	this.dom.style.display = 'flex';
	this.dom.style.alignItems = 'center';
	contents.forEach(function(i){
		if(i!=undefined && i!=''){
			//i.style = options.itemStyle;
			if(options.itemStyle!=undefined){
				for(let key in options.itemStyle){
					i.style[key] = options.itemStyle[key]
				}
			}
			scope.dom.append(i)
		}
	})
	if(options.style!=undefined){
		for(let key in options.style){
			this.dom.style[key] = options.style[key]
		}
	}
	return this;
}

UI.Container.prototype = Object.create(UI.Element.prototype);
UI.Container.prototype.constructor = UI.Container;


UI.Picker = function(values = [], callback){
	let scope = this;
	UI.Element.call(this);
	this.values = values;
	this.callback = callback;
	this.dom = document.createElement('div');
	this.dom.classList.add('altUI_Picker');
	
	this.select = document.createElement('div');
	this.select.classList.add('altUI_Picker_Select');
	
	this.options = document.createElement('div');
	this.options.classList.add('altUI_Picker_Options');
	values.forEach(function(i){
		let option = document.createElement('span');
		option.innerText = i
		option.addEventListener('click', function(e){
			e.preventDefault();
			e.stopPropagation();
			e.stopImmediatePropagation();
			scope.setOption(i)
		})
		if(i!=undefined){
			scope.options.append(option)
		}
	})
	this.select.addEventListener('click', function(e){
		e.preventDefault();
		e.stopPropagation();
		e.stopImmediatePropagation();
		scope.options.style.display = 'block';
	})
	document.body.addEventListener('click', function(){
		scope.options.style.display = 'none';
	})
	this.setOption(values[0])	
	this.dom.append(this.options);
	this.dom.append(this.select)
	return this
}
UI.Picker.prototype = Object.create(UI.Element.prototype);
UI.Picker.prototype.constructor = UI.Picker;
UI.Picker.prototype.setOption = function(option, callback = true){
	this.options.querySelectorAll('span').forEach(function(i){
		if(i.innerText == option){
			i.classList.add('selected')
		}else{
			i.classList.remove('selected')
		}
	})
	//option.classList.add('selected');
	this.select.innerText = option;
	this.options.style.display = 'none'
	if(callback){
		this.callback(option);
	}
	return this
}

UI.Hero = function(imageURL, title){
	let scope = this;
	UI.Element.call(this);
	this.dom = document.createElement('div');
	this.dom.classList.add('altUI_Hero');
	this.dom.style.background = `url(${imageURL})`;
	return this
}
UI.Hero.prototype = Object.create(UI.Element.prototype);
UI.Hero.prototype.constructor = UI.Hero;


UI.NotificationFeedback = function(content, options){
	let dom = document.createElement('div');
	dom.classList.add('altUI_NotificationFeedback');
	dom.append(content);
	document.querySelector('body').append(dom)
	setTimeout(function(){
		dom.remove()
	}, 3000)
}
UI.NotificationFeedback.prototype = Object.create(UI.Element.prototype);
UI.NotificationFeedback.prototype.constructor = UI.NotificationFeedback;

UI.Chart = {}

UI.Chart.Percentage = function(data){
	let scope = this;
	UI.Element.call(this);
	this.dom = document.createElement('div');
	this.dom.classList.add('altUI_Chart_Percentage');
	let all = 0;
	Object.keys(data).map(i => {
		all += data[i]
	});
	Object.keys(data).map(i => {
		let section = document.createElement('div');
		section.classList.add('altUI_Chart_Percentage_Data');
		section.style.width = Math.floor(data[i]*100/all)+'%';
		scope.dom.append(section);
	});
	return this;
}

UI.Chart.Percentage.prototype = Object.create(UI.Element.prototype);
UI.Chart.Percentage.prototype.constructor = UI.Chart.Percentage;

/*UI.ToggleSwitch = function(hint, value, name){
	UI.Element.call(this);
	this.dom = document.createElement('label');
	this.dom.classList.add('alt')
}*/
/*UI.App = function(view){
	UI.Element.call(this)
	this.dom = document.createElement('div');
	this.dom.classList.add('altUI_App');
	
}*/
