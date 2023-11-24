import { userUrls } from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
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

  fetchUsers();
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
    feedbackDiv.textContent = "Please select a user to delete.";
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
      feedbackDiv.textContent = `Failed to delete user. Error: ${errorData.message}`;
    } else {
      feedbackDiv.textContent = "User deleted successfully!";
    }
  } catch (error) {
    feedbackDiv.textContent = `Error: ${error.message}`;
  }

  // Refresh the user table after deletion
  await fetchUsers();
  updateDeleteButton();
}
