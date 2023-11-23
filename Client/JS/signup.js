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
    // const localUrl = 'http://localhost:3000' + '/users/create'
    const hostedUrl = "https://nest.comp4537.com" + "/users/create"

    // xhttp.open("POST", localUrl, true); // Change endpoint later
    xhttp.open("POST", hostedUrl, true);

    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === XMLHttpRequest.DONE) {
            if (xhttp.status === 201 || xhttp.status === 200) {
                document.getElementById("responseText").textContent =
                "User created successfully!";
              console.log("User created successfully");

                // window.location.href = "login.html"
            } else {
                const responseText = document.getElementById("responseText")
                responseText.innerHTML = xhttp.responseText
            }
        }
    }
    xhttp.send(JSON.stringify(data))
}