var savedUsers = new Array();
var currentUser;

class User{
	constructor(username , password , firstName , lastName , email ,birthDate) {
		this.username = username;
		this.password = password;
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.birthDate = birthDate;
	}
}

$(document).ready(function(){
	var user = new User('b','b','b','b','b@gmail.com','25.09.1994');
	savedUsers.push(user);
	currentUser = user;        
})

function ShowDiv(id)
{	
	//hide all divs
	let div1 = document.getElementById('welcome');
	div1.style.visibility="hidden";
	let div2 = document.getElementById('register');
	div2.style.visibility="hidden";
	let div3 = document.getElementById('login');
	div3.style.visibility="hidden";;
	let div4 = document.getElementById('chooseSettings');
	div4.style.visibility="hidden";
	let div5 = document.getElementById('game');
	div5.style.visibility="hidden";
	let div6 = document.getElementById('ready');
	div6.style.visibility="hidden";
	
	//show only one div
	let selectedDiv = document.getElementById(id);
	selectedDiv.style.visibility = "visible";
	/*
	if(id != 'game'){
		window.clearInterval(interval);
		window.clearInterval(intervalMonsters);
		window.clearInterval(intervalStar);
		window.clearInterval(intervalStrawberry);
		window.clearInterval(intervalCherry);
		mainMusic.pause();
		mainMusic.currentTime = 0;
	}*/
}

/*************************ABOUT*********************************/
function ShowDialog(){
	document.getElementById("about").showModal();
}
function CloseDialog(){
	document.getElementById("about").close();
}

//close the about dialog when click outside of it with the mouse
//to close the new html <dialog> tag by clicking on its ::backdrop
//https://stackoverflow.com/questions/25864259/how-to-close-the-new-html-dialog-tag-by-clicking-on-its-backdrop
var dialog = document.getElementById('about');
	dialog.addEventListener('click', function (event) {
		let rect = dialog.getBoundingClientRect();
		let isInDialog=(rect.top <= event.clientY && event.clientY <= rect.top + rect.height
		&& rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
		if (!isInDialog) {
			dialog.close();
		}
});


//check register form
//https://stackoverflow.com/questions/14460925/how-to-add-validation-rules-with-messages-in-jquery-validation
//https://jqueryvalidation.org/
$(document).ready(function(){
	$("#registerForm").validate({
		rules: {
			UsernameRegister: {
				required: true,
				minlength: 1,
				doesUsernameNotExist: true,
			},
			PasswordRegister: {
				required: true,
				minlength: 6,
				isLegalPassword: true,
			},
			FirstName: { 
				required:true,
				minlength: 1,
				checkIfOnlyLetters: true,
			},
			LastName: {
				required:true,
				minlength: 1,
				checkIfOnlyLetters: true,
			},					
			Email: {
				required: true,
				email: true
			},
			BirthDate: {
				required: true,
				minlength: 2,
			},
		},
		messages: {
			UsernameRegister: {
				required:"Please enter a username",
				minlength: "Please enter a username",
				doesUsernameNotExist: "This username already exists, please enter another username",
			},
			PasswordRegister: {
				required: "Please provide a password",
				minlength: "Your password must be at least 6 characters long",
				isLegalPassword: "The password must include only letters and digits",
			},
			FirstName: {
				required: "Please enter your First Name",
				minlength: "Please enter your First Name",
				checkIfOnlyLetters: "First name must include only letters",
				},
			LastName: {
				required: "Please enter your Last Name",
				minlength: "Please enter your Last Name",
				checkIfOnlyLetters: "Last name must include only letters",
			},
			Email: {
				required: "Please enter a valid email address",
				email: "This is not a valid email, please enter a valid email address",
			},
			BirthDate: {
				required: "Please enter your birth date",	
				minlength: "Please enter your birth date",	
			},
		},

		submitHandler : function(form) {
			AddUser(document.getElementById('UsernameRegister').value,document.getElementById('PasswordRegister').value,
			document.getElementById('FirstName').value,document.getElementById('LastName').value,document.getElementById('Email').value,document.getElementById('BirthDate').value);	
			//form.submit();
		},
	}); 

	$.validator.addMethod("doesUsernameNotExist", function(value ,element) {
		return this.optional(element) || !(value in savedUsers);
	});

	//https://stackoverflow.com/questions/18746234/jquery-validate-plugin-password-check-minimum-requirements-regex
	$.validator.addMethod("isLegalPassword", function(value , element) {
		return this.optional(element) || /[A-Za-z]/i.test(value) && /\d/.test(value);
	});

	$.validator.addMethod("checkIfOnlyLetters", function(value , element) {
		return this.optional(element) || /^[A-Za-z]+$/i.test(value) ;
		
	});

});