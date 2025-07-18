import axios from "axios";
import supabase from "./client";

//function will get supabase session and attach the session.access_token to a new axios instance 
// via a HTTP header
const getAxiosClient = async () => {
  // Get the supabase session
  // create an axios instance with the supabase access_token
  // Return the instance
  // Fill code here
  const currentSession = await supabase.auth.getSession();

  const instance = axios.create({
    headers: {
      Authorization: `Bearer ${currentSession.data.session.access_token}`,
    },
  });

//return the axios 'instance' to be used outside of the function
return instance;
};

export default getAxiosClient;
