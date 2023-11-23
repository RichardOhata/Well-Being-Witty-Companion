document.addEventListener('DOMContentLoaded', () => {
    const resetPasswordForm = document.getElementById('resetPasswordForm'); // Replace 'resetPasswordForm' with the actual ID of your form

    resetPasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        resetPassword();
    });

    const resetPassword = () => {
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const feedbackDiv = document.getElementById("responseText").textContent = responseText;

        if (password !== confirmPassword) {
            feedbackDiv.textContent = "Passwords do not match.";
        } else {
            // Passwords match, initiate password reset
            feedbackDiv.textContent = ""; // Clear any previous error messages
            const resetToken = getResetTokenFromUrl(); // Add a function to extract the reset token 
            const data = {
                password
            };
            resetPasswordRequest(data, resetToken);
        }
    };
});

const resetPasswordRequest = async (data, resetToken) => {
    try {
        console.log(resetToken);
        // const localUrl = 'http://localhost:3000/users' + '/reset-password';
        const hostedUrl = 'https://nest.comp4537.com/users' + '/reset-password';

        // const response = await fetch(localUrl, 
        const response = await fetch(hostedUrl,
            {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${resetToken}`, // Add this line to include the token in the headers
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const responseData = await response.json();
            document.getElementById("responseText").textContent = responseData.message;
            console.log(responseData.message);
            // Redirect or perform additional actions as needed
        } else {
            const responseText = await response.text();
            document.getElementById("responseText").textContent = responseText;
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

const getResetTokenFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('token');
};
