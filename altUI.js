/**
 * @author mrdoob / http://mrdoob.com/
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

	var dom = document.createElement( 'span' );
	dom.className = 'Text';
	dom.style.cursor = 'default';
	dom.style.display = 'inline-block';
	dom.style.verticalAlign = 'middle';

	this.dom = dom;
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

UI.Color = function () {

	UI.Element.call( this );

	var scope = this;

	var dom = document.createElement( 'input' );
	dom.className = 'Color';
	dom.style.width = '64px';
	dom.style.height = '17px';
	dom.style.border = '0px';
	dom.style.padding = '2px';
	dom.style.backgroundColor = 'transparent';

	try {

		dom.type = 'color';
		dom.value = '#ffffff';

	} catch ( exception ) {}

	this.dom = dom;

	return this;

};

UI.Color.prototype = Object.create( UI.Element.prototype );
UI.Color.prototype.constructor = UI.Color;

UI.Color.prototype.getValue = function () {

	return this.dom.value;

};

UI.Color.prototype.getHexValue = function () {

	return parseInt( this.dom.value.substr( 1 ), 16 );

};

UI.Color.prototype.setValue = function ( value ) {

	this.dom.value = value;

	return this;

};

UI.Color.prototype.setHexValue = function ( hex ) {

	this.dom.value = '#' + ( '000000' + hex.toString( 16 ) ).slice( - 6 );

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
	this.dom.style.padding = '16px';
	this.dom.style.zIndex = '1000';
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

  	let AppBarToolbar =  document.createElement( 'div' );
  	AppBarToolbar.classList.add('altUI_AppBarToolbar');
	AppBarToolbar.innerHTML = "<h1></h1>"
	AppBarToolbar.append(toolbar);
	
	this.dom.append(AppBarToolbar)
  
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
	this.dom.querySelector(".altUI_AppBarToolbar").querySelector("h1").textContent = title;
	return this;
}
UI.AppBar.prototype.setLogo = function(imageURL){
	this.AppBarLogo.src = imageURL;
	return this;
}
UI.AppBar.prototype.setBackButton = function(content){
	this.leftNav.innerHTML="";
	this.leftNav.append(content)
}



UI.TabView = function(){
	UI.Element.call(this);
	this.dom = document.createElement('div');
	this.dom.classList.add('altUI_TabView');
	let tabs = document.createElement('div');
	tabs.classList.add('altUI_TabViewTabs');
	let views = document.createElement('div');
	views.classList.add('altUI_TabViewViews');
	this.dom.append(tabs);
	this.dom.append(views)
	return this;
}
UI.TabView.prototype = Object.create(UI.Element.prototype);
UI.TabView.prototype.constructor = UI.TabView;
UI.TabView.prototype.addTab = function(i, label, content, iconName=''){
	let scope = this;
	let TabLabel = document.createElement('div');
	TabLabel.classList.add('altUI_TabViewTab');
	TabLabel.textContent = label;
	TabLabel.id = "altUI_TabViewTab_"+i;
	let icon = document.createElement('i');
	icon.classList.add('material-icons');
	icon.textContent = iconName;
	TabLabel.prepend(icon)
	
	let TabContent = document.createElement('div');
	TabContent.classList.add('altUI_TabViewContent');
	TabContent.id = "altUI_TabViewContent_"+i;
	TabContent.innerHTML = '';
	TabContent.append(content)
	this.dom.querySelector('.altUI_TabViewTabs').append(TabLabel);
	this.dom.querySelector('.altUI_TabViewViews').append(TabContent);
	TabLabel.addEventListener('click', function(){scope.setTab(i)});
	//this.setTab(0);
	return this;
}
UI.TabView.prototype.setTab = function(i=0, callback=function(){}){
	this.dom.querySelector('.altUI_TabViewViews').querySelectorAll('.altUI_TabViewContent').forEach(function(l){
		l.classList.remove('altUI_TabViewContentActive')
	})
	this.dom.querySelector('.altUI_TabViewViews').querySelector("#altUI_TabViewContent_"+i).classList.add('altUI_TabViewContentActive')
	this.dom.querySelector('.altUI_TabViewTabs').querySelectorAll('.altUI_TabViewTab').forEach(function(l){
		l.classList.remove('altUI_TabViewTabActive')
	})
	this.dom.querySelector('.altUI_TabViewTabs').querySelector("#altUI_TabViewTab_"+i).classList.add('altUI_TabViewTabActive');
	callback();
	return this;
}

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
	this.dom.style.margin = '8px';
	this.dom.innerText = value;
	return this;
}
UI.Heading.prototype = Object.create(UI.Element.prototype);
UI.Heading.prototype.constructor = UI.Heading;


UI.MasterDetailView = function(sections=[]){
	UI.Element.call(this);
	this.sections = sections;
	this.dom = document.createElement('div');
	this.dom.classList.add('altUI_AppView');
	let scope = this;
	this.sidebar = document.createElement('div');
	this.sidebar.classList.add('altUI_AppViewSidebar');
	
	
	this.detailView = document.createElement('div');
	this.detailView.classList.add('altUI_AppView_Content');
	this.dom.append(this.sidebar);
	this.dom.append(this.detailView);
	
	this.sections.forEach(function(l){
		scope.addSection(l)
	})
	
	return this;
}
UI.MasterDetailView.prototype = Object.create(UI.Element.prototype);
UI.MasterDetailView.prototype.constructor = UI.MasterDetailView;
UI.MasterDetailView.prototype.addSection = function(obj){
	let scope = this;
	this.sections.push(obj);
	
	let sidebarItem = document.createElement('div');
	sidebarItem.classList.add('altUI_AppViewSidebar_item');
	sidebarItem.innerHTML = '';
	sidebarItem.append(obj.sectionItem)
	if(obj.sectionItemStyle!=undefined){
		for(var k in obj.sectionItemStyle){
			sidebarItem.style[k]=obj.sectionItemStyle[k]
		}
	}
	sidebarItem.addEventListener('click', function(){
		scope.detailView.innerHTML = '';
		scope.detailView.append(obj.sectionContent)
	})
	this.sidebar.append(sidebarItem)
	
	return this;
}

UI.StackNavigator = function(initialContent, appBar){
	let scope = this;
	this.stacks = [];
	this.appBar = appBar;
	this.dom = document.createElement('div');
	this.dom.classList.add('altUI_AppView_Content');
	this.dom.append(initialContent);
	this.stacks.forEach(function(l,i){
		scope.appendStack(l)
	});
	return this;
}
UI.StackNavigator.prototype = Object.create(UI.Element.prototype);
UI.StackNavigator.prototype.constructor = UI.StackNavigator;
UI.StackNavigator.prototype.appendStack = function(content, renderFn){
	let scope = this;
	this.stacks.push(content);
	let backdrop = document.createElement('div');
		backdrop.style.position = 'absolute';
		backdrop.style.width= '100%';
		backdrop.style.height= '100%';
		backdrop.style.paddingLeft=32*this.stacks.length+'px';
		backdrop.style.background='rgba(0,0,0,0.2)';
		backdrop.style.display = 'flex';
		backdrop.style.backdropFilter = 'blur(1.2px)'
		backdrop.addEventListener('click', function(){
			if(!document.querySelector(':focus')){
				scope.goBack()
			}
		})
	let stack = document.createElement('div');
		stack.classList.add('altUI_AppView_Content');
		stack.style.boxShadow = '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);'
		stack.innerHTML='';
		stack.append(content);
		stack.addEventListener('click', function(e){
			e.stopImmediatePropagation();
			e.stopPropagation();
		})
	if(renderFn!=undefined){
		renderFn(content, stack);
	}
	backdrop.append(stack);
	this.dom.append(backdrop);
	if(this.appBar != undefined){
		this.appBar.setBackButton( new UI.Button('back', 'icon').gray().dom )
	}
	return this;
}
UI.StackNavigator.prototype.goBack = function(){
	console.log(this.dom)
	if(this.stacks.length > 0){
		this.stacks.pop();
		this.dom.lastElementChild.remove();
	}
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
