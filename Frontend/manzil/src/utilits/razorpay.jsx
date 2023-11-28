
import { baseUrl ,razorpay} from "./constants";
import axios from "axios";

// Function to load the Razorpay script dynamically
export const loadRazorpayScript = () => {
    console.log("llll")
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
};

// Function to create a Razorpay order using Axios
export const createRazorpayOrder = async (planId, amount) => {
  try {
    // Make an API call to your server to create a Razorpay order using Axios
    console.log(planId,amount)
    const response = await axios.post(baseUrl + razorpay, {
        planId,
        amount,
      });
    console.log(response.data,"kkk")
    return response.data;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw error;
  }
};