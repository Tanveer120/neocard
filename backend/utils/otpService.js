// utils/otpService.js

import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
const authToken = process.env.TWILIO_AUTH_TOKEN;   // Your Auth Token from www.twilio.com/console
const serviceSid = process.env.TWILIO_SERVICE_SID; // Your Service SID from Twilio Verify Service


const client = twilio(accountSid, authToken);

export const sendOtp = async (phoneNumber) => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
const authToken = process.env.TWILIO_AUTH_TOKEN;   // Your Auth Token from www.twilio.com/console
const serviceSid = process.env.TWILIO_SERVICE_SID; 

    const client = twilio(accountSid, authToken);
    
    try {
        // const verification = await client.verify.v2.services(serviceSid)
        //     .verifications
        //     .create({ to: phoneNumber, channel: 'sms' });
        console.log("DEBUG: TWILIO_SERVICE_SID =", serviceSid);
console.log("Loaded TWILIO_SERVICE_SID:", process.env.TWILIO_SERVICE_SID);

            const verification = await client.verify.v2.services(serviceSid)
            .verifications
            .create({ to: phoneNumber, channel: 'sms' });
            console.log('OTP sent successfully:', verification.sid);

        return verification.status === 'pending';
    } catch (error) {
        console.error('Error sending OTP:', error);
        return false;
    }
};

export const verifyOtp = async (phoneNumber, otp) => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
const authToken = process.env.TWILIO_AUTH_TOKEN;   // Your Auth Token from www.twilio.com/console
const serviceSid = process.env.TWILIO_SERVICE_SID; 

const client = twilio(accountSid, authToken);
    try {
        console.log('Verifying OTP for:', phoneNumber, 'with code:', otp);
        
        const verificationCheck = await client.verify.v2.services(serviceSid)
            .verificationChecks
            .create({ to: phoneNumber, code: otp });

        return verificationCheck.status === 'approved';
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return false;
    }
};