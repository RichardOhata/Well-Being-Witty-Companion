import { userUrls } from "./config.js";
import { adminStrings } from "./strings.js";
// Show/hide tables based on the selected tab

document.addEventListener("DOMContentLoaded", () => {
  const usersTabBtn = document.getElementById("usersTabBtn");
  const statsTabBtn = document.getElementById("statsTabBtn");
  const deleteUserButton = document.getElementById("deleteUserBtn");
  const createUserButton = document.getElementById("createUserBtn");
  const backBtn = document.getElementById("backBtn");

  deleteUserButton.addEventListener("click", (event) => {
    deleteUser();
  });

  createUserButton.addEventListener("click", (event) => {
    openCreateUserPage();
  });

  backBtn.addEventListener("click", (event) => {
    openLandingPage();
  });

  usersTabBtn.addEventListener("click", () => {
    showTable("usersTable");
  });

  statsTabBtn.addEventListener("click", () => {
    showTable("statsTable");
  });

    fetchUsers();
    fetchStats();
});

async function fetchUsers() {
  try {

    const response = await fetch(userUrls.getUsersUrl, {
      method: "GET",
      credentials: "include",
    });

    if (response.ok) {
      const users = await response.json();
      displayUsers(users);
    } else {
      console.error(adminStrings.fetchUserErrMsg);
    }
  } catch (error) {
    console.error(`${adminStrings.error}:`, error.message);
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
          <td><input type="radio" name="userRadio" data-id="${user.id}"></td>
          <td><button class="editBtn" data-id="${user.id}">Edit</button></td>
        `;
    tableBody.appendChild(row);
  });
  attachEventListeners();
}

function attachEventListeners() {
  const editButtons = document.querySelectorAll(".editBtn");
  editButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const userId = event.currentTarget.getAttribute("data-id");
      editUser(userId);
    });
  });

  const radioButtons = document.querySelectorAll('input[type="radio"]');
  radioButtons.forEach((radio) => {
    radio.addEventListener("change", updateDeleteButton);
  });
}

async function fetchStats() {
    try {
        console.log(userUrls.getStatsUrl)
         const response = await fetch(userUrls.getStatsUrl, 
            {
                method: "GET",
                credentials: "include",
            });
    
            if (response.ok) {
                const stats = await response.json();
                displayStats(stats.stats);
            } else {
                console.error(adminStrings.fetchUserErrMsg);
            }
        } catch (error) {
            console.error(`${adminStrings.error}:`, error.message);
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

export function updateDeleteButton() {
  const deleteButton = document.getElementById("deleteUserBtn");
  const checkedRadio = document.querySelector('input[type="radio"]:checked');

  deleteButton.disabled = !checkedRadio;
}

export function editUser(userId) {
  window.location.href = `edit-user.html?id=${userId}`;
}

function openCreateUserPage() {
  window.location.href = "create-user.html";
}

function openLandingPage() {
  window.location.href = "landing.html";
}

async function deleteUser() {
  const checkedRadio = document.querySelector('input[type="radio"]:checked');
  const feedbackDiv = document.getElementById("feedback");

  if (!checkedRadio) {
    feedbackDiv.textContent = adminStrings.userDeleteFeedback;
    return;
  }

  const id = checkedRadio.getAttribute("data-id");
  try {

    const response = await fetch(userUrls.deleteUserUrl, {
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
      feedbackDiv.textContent = `${adminStrings.deleteUserErrMsg}. ${adminStrings.error}: ${errorData.message}`;
    } else {
      feedbackDiv.textContent = adminStrings.userDeleteSuccess;
    }
  } catch (error) {
    feedbackDiv.textContent = `${adminStrings.error}: ${error.message}`;
  }

  // Refresh the user table after deletion
  await fetchUsers();
  updateDeleteButton();
}
function showTable(tableId) {
  const userTable = document.getElementById("usersTable");
  const statsTable = document.getElementById("statsTable");
  const createUserButton = document.getElementById("createUserBtn");
  const deleteUserButton = document.getElementById("deleteUserBtn");

  // Hide both tables initially
  userTable.style.display = "none";
  statsTable.style.display = "none";

   // Hide or show create and delete buttons based on the selected table
   if (tableId === "usersTable") {
    createUserButton.style.display = "block";
    deleteUserButton.style.display = "block";
  } else {
    createUserButton.style.display = "none";
    deleteUserButton.style.display = "none";
  }
  // Show the selected table
  const selectedTable = document.getElementById(tableId);
  if (selectedTable) {
    selectedTable.style.display = "table";
  }
}