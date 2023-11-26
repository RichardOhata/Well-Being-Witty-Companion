import { userUrls } from "./config.js";
import { forgotPasswordStrings } from "./strings.js";

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
            console.error(forgotPasswordStrings.resetReqErr, error);
            document.getElementById('responseText').textContent = forgotPasswordStrings.err;
        }
    };

    const sendEmailLinkRequest = async (data) => {

        try {
            const response = await fetch(userUrls.forgotPasswordUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const responseData = await response.json();
            document.getElementById('responseText').textContent = responseData.message;
        } catch (error) {
            throw new Error(forgotPasswordStrings.resetReqErr, error);
        }
    };
});
