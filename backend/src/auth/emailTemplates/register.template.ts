export const getRegisterEmailTemplate = ({
  userName,
  userEmail,
  generatedPassword,
}) => {
  return `
    Hi ${userName},
    Welcome to AI Bootcamp!
    Your account has been successfully created. Below are your login details:
    Email: ${userEmail}
    Password: ${generatedPassword}
    
    Login here: ${process.env.FRONTEND_URL}/login
    
    If you did not request this account or need any assistance, please contact our support team.
    We’re excited to have you on board!
    Best regards,
    AI Bootcamp Team
    `;
};
