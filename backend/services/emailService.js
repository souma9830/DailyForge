const SibApiV3Sdk = require('sib-api-v3-sdk');

const client = SibApiV3Sdk.ApiClient.instance;

// We will initialize the API Key inside the sendEmail function or right away 
// since dotenv is already loaded in server.js before requiring services.
/**
 * Sends a transactional email using Brevo (Sendinblue).
 * @param {Object} params - { to: String, subject: String, text: String }
 */
const sendEmail = async ({ to, subject, text }) => {
  // Ensure the API key is read at execution time, after dotenv has loaded
  client.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;
  const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();
  
  try {
    const result = await emailApi.sendTransacEmail({
      sender: {
        email: process.env.SENDER_EMAIL || 'intryo.official@gmail.com',
        name: 'DailyForge Calendar'
      },
      to: [{ email: to }],
      subject,
      textContent: text
    });
    console.log(`[EmailService] Email sent successfully to ${to}. MessageId: ${result.messageId}`);
    return result;
  } catch (err) {
    console.error('[EmailService] Failed to send email:', err.message);
    throw err;
  }
};

module.exports = { sendEmail };
