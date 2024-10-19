const twilio = require('twilio'); 


const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);


const sendVerificationSMS = async (phoneNo, code) => {
    try {
        await client.messages.create({
            to: phoneNo,
            from: process.env.TWILIO_NUMBER, // Your Twilio phone number
            body: `Your verification code is ${code}`,
        });
    } catch (error) {
        console.error('Error sending SMS:', error);
        throw new Error('SMS not sent');
    }
};

module.exports = {
    sendVerificationSMS,
};
