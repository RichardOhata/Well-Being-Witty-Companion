import { userUrls } from "./config.js";
import { landingStrings } from "./strings.js";

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
   
      incrementJokeCount();
     
    });

    fetchHealthAdviceButton.addEventListener("click",  () => {
        fetchHealthAdvice();
        incrementHealthCount();
      });
      
    await getAPICount();
  });
  
  const fetchJoke = () => {
    var age = document.getElementById('ageInput').value;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", landingStrings.endpoint + landingStrings.jokeResource, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            document.getElementById('jokeDisplay').innerText = response.joke;
            getAPICount();
        }
    };
    var data = JSON.stringify({ "age": age });
    xhr.send(data);
}

const fetchHealthAdvice = async() => {
  var age = document.getElementById('ageInput2').value;
  var xhr = new XMLHttpRequest();
  xhr.open("POST", landingStrings.endpoint + landingStrings.healthResource, true); // Update the endpoint URL
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
          var response = JSON.parse(xhr.responseText);
          document.getElementById('adviceDisplay').innerText = response.advice; // Update the element ID
          getAPICount()
      }
  };
  var data = JSON.stringify({ "age": age });
  xhr.send(data);
}

const incrementJokeCount = async () => {

  try {
    const response = await fetch(userUrls.incrementFetchJokeUrl, {
      method: "GET",
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data.message)
    } else {
      console.log(landingStrings.incrementFetchJokeErr)
    }
  } catch (error) {
    console.error(landingStrings.incrementFetchJokeErr, error.message);
  }
};

const incrementHealthCount = async () => {
  try {
    const response = await fetch(userUrls.incrementGetHealthTipUrl, {
      method: "GET",
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data.message);
    } else {
      console.log(landingStrings.incrementHealthTipErr)
    }
  } catch (error) {
    console.error(landingStrings.incrementHealthTipErr, error.message);
  }
};
  
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
        console.log(landingStrings.logoutSuccess);
        window.location.href = "login.html";
      } else {
        window.location.href = "login.html";
        const errorData = await response.json();
        console.error(
          `${landingStrings.logoutFail} ${landingStrings.errors} 
          ${errorData.message || landingStrings.unknownErr}`
        );
      }
    } catch (error) {
      console.error(`${landingStrings.logoutErr} ${error.message}`);
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
        console.log(landingStrings.userProfile, profileData);
      } else {
        const errorData = await response.json();
        console.error(
          `${landingStrings.userProfileFail} ${landingStrings.errors} 
          ${errorData.message || landingStrings.unknownErr}`
        );
      }
    } catch (error) {
      console.error(landingStrings.profileReqErr, error.message);
    }
  };
  
  const goToAdminPage = () => {
    window.location.href = "admin.html";
  }; 
  
  const isAdmin = async () => {
    try {
      const response = await fetch(userUrls.getInfoUrl, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        const isAdmin = data && data.admin === true;
        console.log(isAdmin);        
        return isAdmin;
      }
    } catch (error) {
      console.error(landingStrings.userStatusErr, error);
      return null;
    }
  };

  const getAPICount = async () => {
    try {
      const response = await fetch(userUrls.getInfoUrl, {
        method: "GET",
        credentials: "include",
      });
  
      if (response.ok) {
        const data = await response.json();
        const api_calls = document.getElementById("api-calls")
        api_calls.textContent = landingStrings.apiUsage + data.apiCalls
        console.log(landingStrings.userProfile, data);
      } else {
        const errorData = await response.json();
        console.error(
          `${landingStrings.userProfileFail} ${landingStrings.errors} 
          ${errorData.message || landingStrings.unknownErr}`
        );
      }
    } catch (error) {
      console.error(landingStrings.profileReqErr, error.message);
    }
  }
  