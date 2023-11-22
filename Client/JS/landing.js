document.addEventListener("DOMContentLoaded", async () => {
    const hamburgerIcon = document.getElementById("dropdownIcon");
    const fetchJokeButton = document.getElementById("fetchJokeButton");
    const fetchHealthAdviceButton = document.getElementById("fetchAdviceButton");
    const logoutButton = document.getElementById("logoutBtn");
    const getProfileButton = document.getElementById("profileBtn");
    const goToAdminPageButton = document.getElementById("adminBtn");
      console.log("Landing page")
    const isAdminUser = await isAdmin();
      if (isAdminUser) {
          console.log("NICE")
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
      xhr.open("POST", "http://127.0.0.1:5000/" + "get-joke", true);
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
    var age = document.getElementById('ageInput').value;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://127.0.0.1:5000/" + "get-health-advice", true); // Update the endpoint URL
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
      const response = await fetch("https://nest.comp4537.com" + "/auth/logout", {
        method: "GET",
        credentials: "include",
      });
  
      if (response.ok) {
        console.log("Logout successful");
  
        window.location.href = "login.html";
      } else {
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
      // Fetch user profile logic
      const response = await fetch("https://nest.comp4537.com" + "/auth/profile", {
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
      const response = await fetch("https://nest.comp4537.com" + "/users/getRole", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        const isAdmin = data && data.admin === true;
        console.log(isAdmin);
  
        return isAdmin;
      }
    } catch (error) {
      console.error("Error checking user status:", error);
      return null;
    }
  };
  