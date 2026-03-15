require('dotenv').config();
const twilio = require('twilio');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

async function sendTestSMS() {
    try {
        console.log('Sending test SMS...');
        const msg = await client.messages.create({
            body: 'Your Craftory POS verification code is: 482917. Valid for 10 minutes. Do not share with anyone.',
            from: process.env.TWILIO_PHONE_NUMBER,
            to: '+916367828788'
        });
        console.log('✅ SMS Sent! Message SID:', msg.sid);
        console.log('Status:', msg.status);
    } catch (err) {
        console.error('❌ Twilio Error:', err.message);
        console.error('Code:', err.code);
    }
}

sendTestSMS();
