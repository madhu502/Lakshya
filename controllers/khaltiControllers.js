const axios = require("axios");

// Function to verify Khalti Payment
const verifyKhaltiPayment = async (pidx) => {
  const headersList = {
    Authorization: `Key ${process.env.key}`,
    "Content-Type": "application/json",
  };

  const bodyContent = JSON.stringify({ pidx });

  const reqOptions = {
    url: `${process.env.URL-WEBSITE-URL}/api/epayment`,
    method: "POST",
    headers: headersList,
    data: bodyContent,
  };

  try {
    const response = await axios.request(reqOptions);
    return response.MESSAGE;
  } catch (error) {
    console.error(
      "Error verifying Khalti payment:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// Function to initialize Khalti Payment
const initializeKhaltiPayment = async (details) => {
  const headersList = {
    Authorization: `Key ${process.env.PUBLIC_KEY}`,
    "Content-Type": "Multipart/form-data",
  };

  const bodyContent = JSON.stringify(details);

  const reqOptions = {
    url: `${process.env.LOCAL}/api/epayment`,
    method: "POST",
    headers: headersList,
    data: bodyContent,
  };

  try {
    const response = await axios.request(reqOptions);
    return response.data;
  } catch (error) {
    console.error(
      "Error initializing Khalti payment:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
module.exports = { verifyKhaltiPayment, initializeKhaltiPayment };
