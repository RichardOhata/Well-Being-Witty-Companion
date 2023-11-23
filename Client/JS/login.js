document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm')
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    forgotPasswordLink.addEventListener('click', openForgotPasswordWindow);

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

function openForgotPasswordWindow() {
    // Adjust the window features as needed
    const width = 400;
    const height = 300;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    window.open('forgot-password.html', 'ForgotPasswordWindow', `width=${width},height=${height},left=${left},top=${top}`);
}

const post = (data) => {
    const xhttp = new XMLHttpRequest();
    xhttp.withCredentials = true;
    // const localUrl = 'http://localhost:3000' + '/login';
    const hostedUrl = "https://nest.comp4537.com" + "/auth/login"

    // xhttp.open("POST", localUrl, true); 
    xhttp.open("POST", hostedUrl, true);
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