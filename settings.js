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
	
	if(id != 'game'){
		window.clearInterval(interval);
		window.clearInterval(intervalMonsters);
		window.clearInterval(intervalStar);
		window.clearInterval(intervalStrawberry);
		window.clearInterval(intervalCherry);
		mainMusic.pause();
		mainMusic.currentTime = 0;
	}
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
