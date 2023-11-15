document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm')
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault()
        const username = document.getElementById('username').value
        const password = document.getElementById('password').value
        post({
            username: username,
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