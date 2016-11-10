// The component JoinForm wraps the component JoinInput.

var JoinForm = React.createClass({

  // I have my AJAX function in the outer wrapper.
  // You could include an AJAX function within the 
  // form component if you would like.
  
	contextTypes: {
		fn: React.PropTypes.func.isRequired
		},
		
	getInitialState: function() {
		return {
			Email: '',
			Username: '',
			Password: '',
			Fields: [],
			ServerMessage: ''
		}
	},
	
	// This function is called when the user submits
	// the sign-up form. It first calls the isValid function
	// in the child component JoinInput on each field. If the fields
	// are valid, it submits the data to an AJAX function in the wrapper
	// component and provides a callback for error messaging.
	
	handleClick: function(e) {
		var that = this;
		  e.preventDefault();
		
		// Validate entire form here.
		var validForm = true;
		this.state.Fields.forEach(function(field) {
			if (typeof field.isValid === "function") {
				var validField = field.isValid(field.refs[field.props.name]);
				validForm = validForm && validField;
			}
		});
    
		// After validation, make post request to server.
    // You could do AJAX here.
		if (validForm) {
			var d = {
				inputVars: {
					page: 'sign-up',
					destination: 'user/create',
					pack: {
						email: this.state.Email,
						username: this.state.Username,
						password: this.state.Password
						}
					},
				callback: function() {
					return that.setState({ServerMessage: "Please Check That All Your Fields Are Valid"});
					}
				}
			// call AJAX function fn() in outer wrappper	
			this.context.fn(d);
			}
			else {
				return this.setState({ServerMessage: "Please Check That All Fields Are Valid"});
			}
		},
		
		// As the input fields fire onChange events in the
		// child component, these functions are called to
		// update the state.
		
		onChangeEmail: function(value) {
			this.setState({
				Email: value
			});
		},
		onChangeUsername: function(value) {
			this.setState({
				Username: value
			});
		},
		onChangePassword: function(value) {
			this.setState({
				Password: value
			});
		},
		// register input controls
		register: function(field) {
			var s = this.state.Fields;
			s.push(field);
			this.setState({
				Fields: s
			});
		},
			
	  render: function() {
      return(
          <form name="JoinForm" noValidate >
            <div className="input">
              <JoinInput type={'email'} value={this.state.Email} label={'Enter Your Email Address'} name={'Email'} htmlFor={'Email'}
                isrequired={true} onChange={this.onChangeEmail} onComponentMounted={this.register}
                messageRequired={'Invalid Email'} />
              <JoinInput type={'text'} value={this.state.Username} label={'Enter a Username'} name={'Username'} htmlFor={'Username'}
                isrequired={true} onChange={this.onChangeUsername} onComponentMounted={this.register}
                messageRequired={'Invalid Username'} />
              <JoinInput type={'password'} value={this.state.Password} label={'Enter a Password'} name={'Password'} htmlFor={'Password'}
                isrequired={true} onChange={this.onChangePassword} onComponentMounted={this.register}
                messageRequired={'Invalid Password'} />
              <button type="button" onClick={this.handleClick}>Submit</button>
              <div className="servermessage">{this.state.ServerMessage}</div>
            </div>
          </form>
        );
		}
})


var JoinInput = React.createClass({

  // We use fn() to call the database to check that
  // the username is unique
	contextTypes: {
		fn: React.PropTypes.func.isRequired
	},
	
	// This function sets state as input values change, and it 
	// calls isValid to check validity of input fields.
	
	handleChange: function(e) {
		this.props.onChange(e.target.value);
		var isValidField = this.isValid(e.target);
	},
	
	// This function adds a border and reveals an error
	// message if the field is invalid. It then calls checkForUnique
	// if the field is username.
	 
	handleBlur: function(e) {
		if(e.target.nextSibling.textContent != '') {
			e.target.classList.add('borderline');
			e.target.nextSibling.classList.remove('hidden');
		}
		if(e.target.getAttribute('type') === "text" && e.target.value != "") {
			this.checkForUnique(e.target);
			}
	},
	
	// This function checks in db to see if a chosen username is unique
	// and then uses a callback to alert user if the username is taken.
	
	checkForUnique: function(input) {
		var postPage = '';
		var postVal = {};
		var messText = '';
		console.log(input);
			
		var d = {
			inputVars: {
				page: 'check-username',
				destination: '',
				pack: { "username" : input.value }
				},
			callback: function(myBool) {
				if(myBool === true) {
					input.classList.add('error'); // add class error
					input.nextSibling.textContent = 'This Username Is Taken';
					input.classList.add('borderline');
					input.nextSibling.classList.remove('hidden');
					}
				else {
					return;
				}
			}
		}
		// Call AJAX function fn() in outer wrapper
		this.context.fn(d);
	},
	
	// This function removes the error message when the field gains focus
	
	handleFocus: function(e) {
		e.target.classList.remove('borderline');
		e.target.nextSibling.classList.add('hidden');
	},
	
	// This function checks for the type of input field, calls its 
	// respective validation function, sets the error message, if
	// required, and returns a boolean.
	
	isValid: function(input) {
		//check required field
		if (input.getAttribute('required') != null && input.value ==="") {
			input.classList.add('error'); // add class error
			input.nextSibling.textContent = this.props.messageRequired;
			return false;
		}
		else {
			input.classList.remove('error');
			input.nextSibling.textContent = "";
		}
		// check data type
		if(input.getAttribute('type') == "email" && input.value != "") {
			if(!this.validateEmail(input.value)) {
				input.classList.add('error');
				input.nextSibling.textContent = this.props.messageRequired;
				return false;
			}
			else {
				input.classList.remove('error');
				input.nextSibling.textContent = "";
			}
		}
		if(input.getAttribute('type') == "text" && input.value != "") {
			if(!this.validateUsername(input.value)) {
				input.classList.add('error');
				input.nextSibling.textContent = this.props.messageRequired;
				return false;
			}
			else {
				input.classList.remove('error');
				input.nextSibling.textContent = "";
			}
		}
		if(input.getAttribute('type') == "password" && input.value != "") {
			if(!this.validatePassword(input.value)) {
				input.classList.add('error');
				input.nextSibling.textContent = this.props.messageRequired;
				return false;
			}
			else {
				input.classList.remove('error');
				input.nextSibling.textContent = "";
			}
		}
		return true;
	},
	
	// email validation function
	validateEmail: function(value) {
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(value);
	},
	// username validation function
	validateUsername: function(value) {
		var re = /^\S*$/;
		if(value.length > 2 && re.test(value)) {
			return true;
			}
			else {
				return false;
				}
	},
	// password validation function
	validatePassword: function(value) {
		var re = /^\S*$/;
		if(value.length > 7 && re.test(value)) {
			return true;
			}
			else {
				return false;
				}
	},
	componentDidMount: function() {
		if(this.props.onComponentMounted) {
			this.props.onComponentMounted(this); // register this input in the form
			}
		},
		
	render: function() {
		var inputField;
		inputField = <input type={this.props.type} value={this.props.value} ref={this.props.name} name={this.props.name}
		className='formInput' required={this.props.isrequired} onChange={this.handleChange} onBlur={this.handleBlur} onFocus={this.handleFocus} />
		
		return (
				<div className="inputEnter">
					<label htmlFor={this.props.htmlFor}><h5>{this.props.label}</h5></label>
					{inputField}
					<div className="error hidden"></div>
				</div>
			);
	}
})
