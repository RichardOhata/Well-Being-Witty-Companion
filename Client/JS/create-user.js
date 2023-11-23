document.addEventListener('DOMContentLoaded', () => {
    const createUserForm = document.getElementById('createUserForm');
    const backBtn = document.getElementById("backBtn");
    const doneBtn = document.getElementById("doneBtn");


    doneBtn.addEventListener("click", (event) => {
        openAdminUserPage();
    });

    createUserForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const isAdmin = document.getElementById('isAdmin').checked;

        const userData = {
            username: username,
            email: email,
            password: password,
            isAdmin: isAdmin,
        };

        post(userData);
    });

    backBtn.addEventListener("click", () => {
      window.history.go(-1);
    });
});

function openAdminUserPage() {
    window.location.href = "admin.html";
}


const post = (data) => {
    const xhttp = new XMLHttpRequest();
    xhttp.withCredentials = true;

    const localUrl = 'http://localhost:3000' + '/users/create';
    const hostedUrl = 'https://nest.comp4537.com' + '/users/create';

    xhttp.open('POST', localUrl, true);
    xhttp.setRequestHeader('Content-Type', 'application/json');

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === XMLHttpRequest.DONE) {
            if (xhttp.status === 201 || xhttp.status === 200) {
                document.getElementById('responseText').textContent = 'User created successfully!';
                console.log('User created successfully');
            } else {
                const responseText = document.getElementById('responseText');
                responseText.innerHTML = xhttp.responseText;
            }
        }
    };

    xhttp.send(JSON.stringify(data));
};
