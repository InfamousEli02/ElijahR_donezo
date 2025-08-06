import { Link, Outlet, useNavigate } from 'react-router-dom';
import supabase from "../client";


export default function MainLayout(){

  const navigate = useNavigate();

  //function for logging out
  const logoutUser = async() => {

    //Calls supabase's logout methods to log out user
    const { error } = await supabase.auth.signOut({scope : 'local'});

    if(error){
      console.error("There was an error when logging out:", error)
    } else {
      console.log("Logging out")

      setTimeout(() => {
          navigate("/login");
      }, 1000);
    } 
  };


  return (
    //navigation bar for the login (link to homepage, button for logout)
    //The Outlet component acts as a placeholder that dynamically renders the child route component 
    // based on the current URL path
    <>
      <div className="navbar bg-gray-500/50 border-2 border-gray-500 border-solid">
        <div className="flex-1">
          <Link to="/todos" className="btn btn-ghost text-white text-xl">Donezo</Link>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li>
              <button className="btn btn-link" onClick={logoutUser}>Logout</button>
            </li>
          </ul>
        </div>
      </div>
      <Outlet />
    </>
  )
}