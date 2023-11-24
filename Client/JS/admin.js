document.addEventListener("DOMContentLoaded", () => {

    const deleteUserButton = document.getElementById("deleteUserBtn");
    const createUserButton = document.getElementById("createUserBtn");

    deleteUserButton.addEventListener("click", (event) => {
        deleteUser();
    });

    createUserButton.addEventListener("click", (event) => {
        openCreateUserPage();
    });

    fetchUsers();
    fetchStats();
});


async function fetchUsers() {
    try {
        // const localUrl = 'http://localhost:3000' + '/users/getUsers'
        const hostedUrl = "https://nest.comp4537.com" + "/users/getUsers"

        // const response = await fetch(localUrl,
        const response = await fetch(hostedUrl, 
        {
            method: "GET",
            credentials: "include",
        });

        if (response.ok) {
            const users = await response.json();
            displayUsers(users);
        } else {
            console.error("Failed to fetch users");
        }
    } catch (error) {
        console.error("Error:", error.message);
    }
}

function displayUsers(users) {
    const tableBody = document.getElementById("userTableBody");
    tableBody.innerHTML = "";

    users.forEach((user) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${user.username}</td>
          <td>${user.email}</td>
          <td>${user.apicalls}</td>
          <td><input type="radio" name="userRadio" data-id="${user.id}" onchange="updateDeleteButton()"></td>
        `;
        tableBody.appendChild(row);
    });
}

async function fetchStats() {
    try {
        const hostedUrl = "http://localhost:3000" + "/getStats" // Change to hosted url later
         const response = await fetch(hostedUrl, 
            {
                method: "GET",
                credentials: "include",
            });
    
            if (response.ok) {
                const stats = await response.json();
                displayStats(stats);
            } else {
                console.error("Failed to fetch users");
            }
        } catch (error) {
            console.error("Error:", error.message);
        }
}

function displayStats(stats) {
    const tableBody = document.getElementById("statsTableBody");
    tableBody.innerHTML = "";

    stats.forEach((stat) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${stat.method}</td>
          <td>${stat.endpoint}</td>
          <td>${stat.request_count}</td>
          <td>${stat.last_served_at}</td>
          <td>${stat.description}</td>
        `;
        tableBody.appendChild(row);
    });
}

function updateDeleteButton() {
    const deleteButton = document.getElementById("deleteUserBtn");
    const checkedRadio = document.querySelector('input[type="radio"]:checked');

    deleteButton.disabled = !checkedRadio;
}

function openCreateUserPage() {
    window.open("signup.html", "_blank", "width=400,height=400");
}

async function deleteUser() {
    const checkedRadio = document.querySelector('input[type="radio"]:checked');
    const feedbackDiv = document.getElementById("feedback");

    if (!checkedRadio) {
        feedbackDiv.textContent = "Please select a user to delete.";
        return;
    }

    const id = checkedRadio.getAttribute("data-id");
    try {
        const localUrl = 'http://localhost:3000' + '/users/delete'
        const hostedUrl = "https://nest.comp4537.com" + "/users/delete"

        // const response = await fetch(localUrl, 
        const response = await fetch(hostedUrl, 
            {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            feedbackDiv.textContent = `Failed to delete user. Error: ${errorData.message}`;
        } else {
            feedbackDiv.textContent = "User deleted successfully!";
        }
    } catch (error) {
        feedbackDiv.textContent = `Error: ${error.message}`;
    }

    // Refresh the user table after deletion
    fetchUsers();
    updateDeleteButton();
}

