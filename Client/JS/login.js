document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm')

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault()
        const email = document.getElementById('email').value
        const password = document.getElementById('password').value
        post({
            email: email,
            password: password
        })
    });
});

const post = (data) => {
    const xhttp = new XMLHttpRequest();
    xhttp.withCredentials = true;
    xhttp.open("POST", "https://nest.comp4537.com" + "/auth/login", true); 
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === XMLHttpRequest.DONE) {
            if (xhttp.status === 200) {
                window.location.href = "landing.html"
            } else {
                const responseText = document.getElementById("responseText")
                responseText.innerHTML = xhttp.responseText
            }
        }
    }
    xhttp.send(JSON.stringify(data))
}