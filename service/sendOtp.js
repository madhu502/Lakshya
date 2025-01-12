const axios = require("axios");
const sendOtp = async (phone, otp) => {
  //setting state
  let isSent = false;

  //Url to send otp
  const url = "https://api.managepoint.co/api/sms/send";

  //Payload to send
  const payload = {
    apiKey: "4801862d-7775-4fb9-a6d3-00ee89bf95dd",
    to: phone,
    message: `Your Verification code ${otp}`,
  };

  try {
    const res = await axios.post(url, payload);
    if (res.status === 200) {
      isSent = true;
    }
  } catch (error) {
    console.log("Error sending OTP", error.message);
  }
  return isSent;
};
module.exports = sendOtp;
