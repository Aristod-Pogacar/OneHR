import axios from "axios";

const apiUrl = process.env.EXPO_PUBLIC_API_URL + ":" + process.env.EXPO_PUBLIC_PORT + "/";
const api = axios.create({
    baseURL: apiUrl, // change ici
    timeout: 200000,
    headers: {
        "Content-Type": "application/json",
    },
});
console.log("apiUrl:", apiUrl);

export default api;
