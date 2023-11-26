import { userUrls } from "./config.js";

document.addEventListener("DOMContentLoaded", async () => {
    const hamburgerIcon = document.getElementById("dropdownIcon");
    const fetchJokeButton = document.getElementById("fetchJokeButton");
    const fetchHealthAdviceButton = document.getElementById("fetchAdviceButton");
    const logoutButton = document.getElementById("logoutBtn");
    const getProfileButton = document.getElementById("profileBtn");
    const goToAdminPageButton = document.getElementById("adminBtn");
    const isAdminUser = await isAdmin();
      if (isAdminUser) {
          goToAdminPageButton.style.display = "block";
      } else {
          goToAdminPageButton.style.display = "none";
      }
  
    hamburgerIcon.addEventListener("click",  () => {
      toggleDropdown();
    });
  
    logoutButton.addEventListener("click", () => {
      logout();
    });
  
    getProfileButton.addEventListener("click", () => {
      getProfile();
    });
  
    goToAdminPageButton.addEventListener("click", () => {
      goToAdminPage();
    });
  
    fetchJokeButton.addEventListener("click",  () => {
      fetchJoke();
    });

    fetchHealthAdviceButton.addEventListener("click",  () => {
        fetchHealthAdvice();
      });
  });
  
  const fetchJoke = () => {
    var age = document.getElementById('ageInput').value;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://thantyatithaw.pythonanywhere.com/" + "get-joke", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            document.getElementById('jokeDisplay').innerText = response.joke;
        }
    };
    var data = JSON.stringify({ "age": age });
    xhr.send(data);
}

const fetchHealthAdvice = () => {
  var age = document.getElementById('ageInput2').value;
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "https://thantyatithaw.pythonanywhere.com/" + "get-health-advice", true); // Update the endpoint URL
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
          var response = JSON.parse(xhr.responseText);
          document.getElementById('adviceDisplay').innerText = response.advice; // Update the element ID
      }
  };
  var data = JSON.stringify({ "age": age });
  xhr.send(data);
}
  
  const toggleDropdown = () => {
    var dropdownContent = document.getElementById("dropdownContent");
    dropdownContent.style.display =
      dropdownContent.style.display === "block" ? "none" : "block";
  };
  
  const logout = async () => {
    try {

      const response = await fetch(userUrls.logoutUrl, {
        method: "GET",
        credentials: "include",
      });
  
      if (response.ok) {
        console.log("Logout successful");
        window.location.href = "login.html";
      } else {
        window.location.href = "login.html";
        const errorData = await response.json();
        console.error(
          "Failed to logout. Errors:",
          errorData.message || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error during logout:", error.message);
    }

  };
  
  const getProfile = async () => {
    try {
      const response = await fetch(userUrls.getProfileUrl, {
        method: "GET",
        credentials: "include",
      });
  
      if (response.ok) {
        const profileData = await response.json();
        console.log("User profile:", profileData);
      } else {
        const errorData = await response.json();
        console.error(
          "Failed to get user profile. Errors:",
          errorData.message || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error during profile request:", error.message);
    }
  };
  
  const goToAdminPage = () => {
    window.location.href = "admin.html";
  }; 
  
  
  
  // Placeholder function, replace with your actual authorization logic
  const isAdmin = async () => {
    try {
      const response = await fetch(userUrls.getRoleUrl, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        const isAdmin = data && data.admin === 1;
        console.log(isAdmin);
  
        return isAdmin;
      }
    } catch (error) {
      console.error("Error checking user status:", error);
      return null;
    }
  };
  