import { userUrls } from "./config.js";
import { editUserStrings } from "./strings.js";

document.addEventListener("DOMContentLoaded", () => {
  const id = new URLSearchParams(window.location.search).get("id");

  if (!id) {
    console.error(editUserStrings.useridMissing);
    // Handle the error, maybe redirect back to the admin page
    return;
  }

  const editUserForm = document.getElementById("editUserForm");

  const doneBtn = document.getElementById("doneBtn");

  doneBtn.addEventListener("click", (event) => {
      openAdminUserPage();
  });

  // Fetch user data when the page loads
  fetchUserData(id)
    .then((userData) => {
      // Populate form fields with user data
      document.getElementById("username").value = userData.username;
      document.getElementById("email").value = userData.email; // Add this line for the email field
      document.getElementById("userRole").value = userData.admin
        ? "admin"
        : "user"; // Assuming admin is a boolean
      // Populate other fields as needed
    })
    .catch((error) => {
      console.error(`${editUserStrings.userDataFetchErr}: ${error.message}`);
      // Handle the error, maybe show a message to the user
    });

  editUserForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // Get the current values from the form
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const isAdmin = document.getElementById("userRole").value === "admin";

    // Call a function to update the user in the database
    updateUser(id, { username, email, admin: isAdmin });
  });

  const backBtn = document.getElementById("backBtn");
  backBtn.addEventListener("click", () => {
    window.history.go(-1);
  });
});

const fetchUserData = async (id) => {
  try {
    const response = await fetch(userUrls.fetchUserUrl(id), {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const userData = await response.json();
      console.log("User data:", userData);
      return userData; // Assuming you want to use the data in the caller
    } else {
      const errorData = await response.json();
      console.error(
        `${editUserStrings.userDataFetchFail}. ${editUserStrings.errors}: 
        ${errorData.message || editUserStrings.unknownErr}`
      );
      throw new Error(errorData.message || editUserStrings.unknownErr);
    }
  } catch (error) {
    console.error(editUserStrings.dataReqErr, error.message);
    throw error;
  }
};

const updateUser = async (id, userData) => {
  try {
    const response = await fetch(userUrls.updateUserUrl(id), {
      method: "PATCH", // Use the appropriate HTTP method for updating
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      console.log(editUserStrings.userUpdateSuccess);
      document.getElementById('responseText').textContent = editUserStrings.userEditSuccess;
      console.log(editUserStrings.userCreateSuccess);
      // Optionally, you can redirect or show a success message
    } else {
      const errorData = await response.json();
      console.error(
        `${editUserStrings.userUpdateFail} ${editUserStrings.errors}: 
        ${errorData.message || editUserStrings.unknownErr}`
      );
      // Handle the error, maybe show a message to the user
    }
  } catch (error) {
    console.error(editUserStrings.updateUserErr, error.message);
    // Handle the error, maybe show a message to the user
  }
};

function openAdminUserPage() {
    window.location.href = "admin.html";
}
