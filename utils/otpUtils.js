// Function to generate a random OTP of given length
const generateOTP = (length = 6) => {
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += Math.floor(Math.random() * 10); // Generates a random digit (0-9)
    }
    return otp;
  };
  
  // Function to verify if an OTP matches the stored OTP (can be extended)
  const verifyOTP = (storedOTP, enteredOTP) => {
    return storedOTP === enteredOTP; // Simple comparison
  };
  
  module.exports = { generateOTP, verifyOTP };
  