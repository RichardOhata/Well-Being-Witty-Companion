document.addEventListener("DOMContentLoaded", () => {
  const id = new URLSearchParams(window.location.search).get("id");

  if (!id) {
    console.error("User ID not provided in the URL");
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
      console.error("Error fetching user data:", error.message);
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
    const localUrl = "http://localhost:3000" + `/users/${id}`;
    const hostedUrl = "https://nest.comp4537.com" + `/users/${id}`; // Removed the extra slash

    const response = await fetch(localUrl, {
      method: "GET", // Change the method to GET
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
        "Failed to fetch user data. Errors:",
        errorData.message || "Unknown error"
      );
      throw new Error(errorData.message || "Unknown error");
    }
  } catch (error) {
    console.error("Error during user data request:", error.message);
    throw error;
  }
};

const updateUser = async (id, userData) => {
  try {
    const localUrl = "http://localhost:3000" + `/users/${id}`;
    const hostedUrl = "https://nest.comp4537.com" + `/users/${id}`;

    const response = await fetch(localUrl, {
      method: "PATCH", // Use the appropriate HTTP method for updating
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      console.log("User updated successfully");
      document.getElementById('responseText').textContent = 'User edited successfully!';
      console.log('User created successfully');
      // Optionally, you can redirect or show a success message
    } else {
      const errorData = await response.json();
      console.error(
        "Failed to update user. Errors:",
        errorData.message || "Unknown error"
      );
      // Handle the error, maybe show a message to the user
    }
  } catch (error) {
    console.error("Error updating user:", error.message);
    // Handle the error, maybe show a message to the user
  }
};

function openAdminUserPage() {
    window.location.href = "admin.html";
}
