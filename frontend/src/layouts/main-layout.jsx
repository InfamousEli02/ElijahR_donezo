import { Link, Outlet } from 'react-router-dom';

export default function MainLayout(){
  return (
    //navigation bar for the login (link to homepage, button for logout)
    //The Outlet component acts as a placeholder that dynamically renders the child route component 
    // based on the current URL path
    <>
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">Donezo</a>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li><button className="btn btn-link">Logout</button></li>
          </ul>
        </div>
      </div>
      <Outlet />
    </>
  )
}