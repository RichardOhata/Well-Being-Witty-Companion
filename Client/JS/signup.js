document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm')
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault()
        const username = document.getElementById('username').value
        const email = document.getElementById('email').value
        const password = document.getElementById('password').value
        post({
            username: username,
            email: email,
            password: password
        })
    });
});

const post = (data) => {
    const xhttp = new XMLHttpRequest();
    xhttp.withCredentials = true;
    xhttp.open("POST", "http://localhost:8000", true); // Change endpoint later
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === XMLHttpRequest.DONE) {
            console.log(this.responseText)
        }
    }
    xhttp.send(JSON.stringify(data))
}