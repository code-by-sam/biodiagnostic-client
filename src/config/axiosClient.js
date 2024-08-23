import axios from "axios";

const AxiosClient = axios.create({
  baseURL: "https://biodiagnostic.onrender.com/",
});

export default AxiosClient;
