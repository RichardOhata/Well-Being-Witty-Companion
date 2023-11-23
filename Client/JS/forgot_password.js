document.addEventListener('DOMContentLoaded', () => {
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');

    forgotPasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        sendEmailLink();
    });

    const sendEmailLink = async () => {
        const email = document.getElementById('email').value;
        const data = {
            email
        };

        try {
            await sendEmailLinkRequest(data);
        } catch (error) {
            console.error('Error sending reset request:', error);
            document.getElementById('responseText').textContent = 'An error occurred.';
        }
    };

    const sendEmailLinkRequest = async (data) => {
        const localUrl = 'http://localhost:3000' + '/auth/forgot-password'
        const hostedUrl = 'https://nest.comp4537.com/auth/forgot-password';

        try {
            // const response = await fetch(localUrl,
            const response = await fetch(hostedUrl, 
                {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const responseData = await response.json();
            document.getElementById('responseText').textContent = responseData.message;
        } catch (error) {
            throw new Error('Error sending reset request:', error);
        }
    };
});
