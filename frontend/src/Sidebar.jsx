
// import React, { forwardRef } from 'react';
// import { NavLink, useNavigate } from 'react-router-dom';
// import { HiFingerPrint, HiCog, HiChat, HiUserGroup, HiDocumentText, HiLogout } from "react-icons/hi";
// import { useTheme } from './App'; 
// import { useUser } from './UserContext'; // Import the UserContext

// const Sidebar = forwardRef(({ onLogout, isOpen }, ref) => {
//   const navigate = useNavigate();
//   const { user } = useUser(); // Use the user context
//   const { theme } = useTheme(); 

//   const handleLogout = () => {
//     onLogout();
//     navigate('/login');
//   };

//   if (!user) {
//     return null;
//   }

//   return (
//     <div ref={ref} className={`fixed z-10 top-0 left-0 h-full w-72 p-6 flex flex-col justify-between shadow-lg transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
//       <h1 className="text-3xl font-bold text-center">Space Rants</h1>
//       <div className="flex flex-col items-center">
//         {user.profile_image_url ? (
//           <img
//             src={user.profile_image_url}
//             alt="Profile"
//             className="w-32 h-32 rounded-full object-cover mb-6"
//           />
//         ) : (
//           <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-gray-500 mb-3 border-4 border-gray-500">
//             No Image
//           </div>
//         )}
//         <p className={`text-center text-xl mb-5 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}><strong>{user.first_name} {user.last_name}</strong></p>
//       </div>
//       <nav>
//         <ul className="space-y-4">
//           <li className='flex-1'>
//             <NavLink 
//               to="/dashboard" 
//               className={({ isActive }) => 
//                 isActive ? "text-white flex items-center py-2 px-4 bg-indigo-700 rounded-md transition duration-200" : "text-white flex items-center py-2 px-4 bg-indigo-500 hover:bg-indigo-700 rounded-md transition duration-200"
//               }
//             >
//               <HiFingerPrint className='mt-1 mr-2'/>
//               Dashboard
//             </NavLink>
//           </li>
//           <li className='flex-1'>
//             <NavLink 
//               to="/messages" 
//               className={({ isActive }) => 
//                 isActive ? "text-white flex items-center py-2 px-4 bg-indigo-700 rounded-md transition duration-200" : "text-white flex items-center py-2 px-4 bg-indigo-500 hover:bg-indigo-700 rounded-md transition duration-200"
//               }
//             >
//               <HiChat className='mt-1 mr-2'/>
//               Messages
//             </NavLink>
//           </li>
//           <li className='flex-1'>
//             <NavLink 
//               to="/following" 
//               className={({ isActive }) => 
//                 isActive ? "text-white flex items-center py-2 px-4 bg-indigo-700 rounded-md transition duration-200" : "text-white flex items-center py-2 px-4 bg-indigo-500 hover:bg-indigo-700 rounded-md transition duration-200"
//               }
//             >
//               <HiUserGroup className='mt-1 mr-2' />
//               Friends
//             </NavLink>
//           </li>
//           <li className='flex-1'>
//             <NavLink 
//               to="/user-posts" 
//               className={({ isActive }) => 
//                 isActive ? "text-white flex items-center py-2 px-4 bg-indigo-700 rounded-md transition duration-200" : "text-white flex items-center py-2 px-4 bg-indigo-500 hover:bg-indigo-700 rounded-md transition duration-200"
//               }
//             >
//               <HiDocumentText className='mt-1 mr-2' />
//               Profile
//             </NavLink>
//           </li>
//         </ul>
//       </nav>
//       <div className="mt-20">
//         <div>
//           <nav>
//             <ul className="space-y-4">
//               <li className='flex-1'>
//                 <NavLink 
//                   to="/settings" 
//                   className={({ isActive }) => 
//                     isActive ? "text-white flex items-center py-2 px-4 bg-indigo-700 rounded-md transition duration-200" : "text-white flex items-center py-2 px-4 bg-indigo-500 hover:bg-indigo-700 rounded-md transition duration-200"
//                   }
//                 >
//                   <HiCog className='mt-1 mr-2' />
//                   Settings
//                 </NavLink>
//               </li>
//               <li className='flex-1'>
//                 <NavLink
//                   onClick={handleLogout}
//                   className="text-white flex items-center py-2 px-4 bg-red-500 hover:bg-red-700 rounded-md transition duration-200 "
//                 >
//                   <HiLogout className='mt-1 mr-2' />
//                   Logout
//                 </NavLink>
//               </li>
//             </ul>
//           </nav>
//         </div>
//       </div>
//     </div>
//   );
// });

// export default Sidebar;



// import { ChevronLast, ChevronFirst } from "lucide-react";
// import { React, useContext, createContext, useState, useEffect, forwardRef } from "react";
// import classNames from 'classnames';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { DASHBOARD_SIDEBAR_LINKS, DASHBOARD_SIDEBAR_BOTTOM_LINKS } from './navigation';
// import { useUser } from './UserContext'; // Import the UserContext
// import { useTheme } from './App'; // Import the theme context
// import HeaderLogo from './Logo 3.png';
// import HeaderLogo2 from './Logo 1.png';
// import { NavLink } from 'react-router-dom';
// import { MdLogout } from "react-icons/md";

// const SidebarContext = createContext();

// const linkClasses = 'rounded-lg flex items-center gap-2 font-light px-3 py-2 hover:bg-indigo-300 hover:no-underline active:bg-indigo-500 text-base';

// const Sidebar = forwardRef(({ onLogout, isOpen }, ref) => {
//     const { theme } = useTheme();
//     const [expanded, setExpanded] = useState(true);
//     // const [user, setUser] = useState(null);
//     const navigate = useNavigate();
//     const { user } = useUser(); // Use the user context
    

//     // useEffect(() => {
//     //     const storedUser = localStorage.getItem('user');

//     //     if (storedUser) {
//     //         const parsedUser = JSON.parse(storedUser);
//     //         setUser(parsedUser);
//     //     } else {
//     //         navigate('/login');
//     //     }
//     // }, [navigate]);

    

//     const handleLogout = () => {
//         onLogout();
//         navigate('/login');
//     };

//     if (!user) {
//         return <div></div>;
//     }

//     return (
//         <aside ref={ref} className="h-screen">
//             <nav className={`h-full flex flex-col  border-r shadow-sm rounded-lg ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
//                 <div className="p-4 pb-2 flex justify-between items-center rounded-lg">
//                     <img src={theme === 'dark' ? HeaderLogo : HeaderLogo2} alt='Logo'
//                         className={`overflow-hidden transition-all rounded-lg ${expanded ? "w-32" : "w-0"}`}
//                     />
//                     <button
//                         onClick={() => setExpanded((curr) => !curr)}
//                         className={`p-1.5 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-500 ' : ' text-black bg-gray-200 hover:bg-gray-300 '}`}
//                     >
//                         {expanded ? <ChevronFirst /> : <ChevronLast />}
//                     </button>
//                 </div>

//                 <SidebarContext.Provider value={{ expanded }}>
//                     <div className={`flex flex-col items-center gap-2 px-1 py-3 mb-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'} `}>
//                         {expanded && <UserProfile user={user} />}
//                     </div>

//                     <ul className={`flex-1 px-3 gap-0.5 rounded-lg ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
//                         {DASHBOARD_SIDEBAR_LINKS.map((item) => (
//                             <SidebarItem key={item.key} item={item} />
//                         ))}
//                     </ul>

//                     <ul className={`flex flex-col gap-0.5 pt-2 border-t border-black-700 px-3 rounded-lg ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
//                         {DASHBOARD_SIDEBAR_BOTTOM_LINKS.map((item) => (
//                             <SidebarItem key={item.key} item={item} />
//                         ))}
//                     </ul>
//                     <ul className={`flex flex-col gap-0.5 pt-2 px-3 rounded-lg ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
//                         <NavLink
//                             onClick={handleLogout}
//                             className="text-white flex items-center py-2 px-4 hover:bg-red-700 rounded-md transition duration-200"
//                         >
//                             <MdLogout className={`mt-1 mr-2 ${theme === 'dark' ? ' text-white' : ' text-black'}`} />
//                             <span className={`overflow-hidden transition-all justify-items-center rounded-lg font-semibold ${expanded ? "w-52 ml-1" : "w-0"} ${theme === 'dark' ? ' text-white' : ' text-black'}`}>
//                                 Logout
//                             </span>
//                         </NavLink>
//                     </ul>
//                 </SidebarContext.Provider>
//             </nav>
//         </aside>
//     );
// });

// export default Sidebar;

// function SidebarItem({ item }) {
//     const { expanded } = useContext(SidebarContext);
//     const { pathname } = useLocation();
//     const { theme } = useTheme();

//     return (
//         <li className={classNames(
//             pathname === item.path ? 'bg-indigo-500 text-white rounded-lg' : 'text-black rounded-lg',
//             linkClasses,
//             `relative flex items-center py-2 px-3 my-1 font-medium rounded-lg cursor-pointer transition-colors group ${theme === 'dark' ? ' text-white' : ' text-black'}`
//         )}>
//             <Link to={item.path} className="flex items-center gap-2 justify-items-center ml-2 rounded-lg ">
//                 {item.icon}
//                 <span className={`overflow-hidden transition-all justify-items-center rounded-lg font-semibold ${expanded ? "w-52 ml-1" : "w-0"}`}>
//                     {item.label}
//                 </span>
//             </Link>
//             {item.alert && (
//                 <div className={`absolute right-2 w-2 h-2 bg-indigo-400 rounded-lg ${expanded ? "" : "top-2"}`} />
//             )}
//             {!expanded && (
//                 <div className={`
//                     absolute left-full rounded-lg px-2 py-1 ml-6
//                      text-black text-sm 
//                     invisible opacity-20 -translate-x-3 transition-all
//                     group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 ${theme === 'dark' ? ' text-gray-700 bg-indigo-300' : ' text-black bg-indigo-300'}
//                 `}>
//                     {item.label}
//                 </div>
//             )}
//         </li>
//     );
// }

// function UserProfile({ user }) {
//     return (
//         <div>
//             <div className="h-24 w-24 rounded-full bg-cover bg-no-repeat bg-center mx-auto">
//                 {user.profile_image_url ? (
//                 <img src={user.profile_image_url} alt="Profile" className="w-24 h-24 rounded-full object-cover p-1 ring-2 ring-gray-200" />
//                     ) : (
//                         <div className={`flex items-center justify-center text-white mb-2 h-24 w-24 rounded-full bg-cover bg-no-repeat bg-center ${theme === 'dark' ? 'bg-gray-900 text-white ' : 'bg-slate-100 text-black '}`}>
//                         No Image
//                         </div>
//                     )}
//             </div>
//             <div className="flex justify-between overflow-hidden transition-all w-52 ml-18 rounded-lg">
//                 <div className="leading-4 text-center mx-auto">
//                     <h4 className="font-semibold w-full mt-4 rounded-lg">
//                         {user.first_name} {user.last_name}
//                     </h4>
//                     <span className="font-lg text-semibold text-xs text-center leading-6 text-gray-600">
//                         {user.email}
//                     </span>
//                 </div>
//             </div>
//         </div>
//     );
// }

  
// //   export default UserProfile;


import React, { useState, useContext, forwardRef, createContext } from 'react'; // Add createContext here
import { ChevronLast, ChevronFirst } from "lucide-react";
import classNames from 'classnames';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from './UserContext'; // Import the UserContext
import { useTheme } from './App';
import HeaderLogo from './Logo 3.png';
import HeaderLogo2 from './Logo 1.png';
import { NavLink } from 'react-router-dom';
import { MdLogout } from "react-icons/md";
import { DASHBOARD_SIDEBAR_LINKS, DASHBOARD_SIDEBAR_BOTTOM_LINKS, ADMIN_LINKS } from './navigation';

const SidebarContext = createContext(); // Create context here

const linkClasses = 'rounded-lg flex items-center gap-2 font-light px-3 py-2 hover:bg-indigo-300 hover:no-underline active:bg-indigo-500 text-base';

const Sidebar = forwardRef(({ onLogout, isOpen }, ref) => {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(true);
  const navigate = useNavigate();
  const { user } = useUser(); // Use the user context

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  if (!user) {
    return <div></div>;
  }

  return (
    <aside ref={ref} className="h-screen">
      <nav className={`h-full flex flex-col border-r shadow-sm rounded-lg ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
        <div className="p-4 pb-2 flex justify-between items-center rounded-lg">
          <img src={theme === 'dark' ? HeaderLogo : HeaderLogo2} alt='Logo'
            className={`overflow-hidden transition-all rounded-lg ${expanded ? "w-32" : "w-0"}`}
          />
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className={`p-1.5 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-500 ' : 'text-black bg-gray-200 hover:bg-gray-300 '}`}
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <div className='flex flex-col items-center gap-2 px-1 py-3 mb-4 rounded-lg '>
            {expanded && <UserProfile user={user} theme={theme} />}
          </div>

          <ul className={`flex-1 px-3 gap-0.5 rounded-lg ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
            {DASHBOARD_SIDEBAR_LINKS.map((item) => (
              <SidebarItem key={item.key} item={item} />
            ))}
            {user.isAdmin && ADMIN_LINKS.map((item) => (
              <SidebarItem key={item.key} item={item} />
            ))}
          </ul>

          <ul className={`flex flex-col gap-0.5 pt-2 border-t border-black-700 px-3 rounded-lg ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
            {DASHBOARD_SIDEBAR_BOTTOM_LINKS.map((item) => (
              <SidebarItem key={item.key} item={item} />
            ))}
          </ul>
          <ul className={`flex flex-col gap-0.5 pt-2 px-3 rounded-lg ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
            <NavLink
              onClick={handleLogout}
              className="text-white flex items-center py-2 px-4 hover:bg-red-700 rounded-md transition duration-200"
            >
              <MdLogout className={`mt-1 mr-2 ${theme === 'dark' ? 'text-white' : 'text-black'}`} />
              <span className={`overflow-hidden transition-all justify-items-center rounded-lg font-semibold ${expanded ? "w-52 ml-1" : "w-0"} ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                Logout
              </span>
            </NavLink>
          </ul>
        </SidebarContext.Provider>
      </nav>
    </aside>
  );
});

export default Sidebar;

function SidebarItem({ item }) {
  const { expanded } = useContext(SidebarContext);
  const { pathname } = useLocation();
  const { theme } = useTheme();

  return (
    <li className={classNames(
      pathname === item.path ? 'bg-indigo-500 text-white rounded-lg' : 'text-black rounded-lg',
      linkClasses,
      `relative flex items-center py-2 px-3 my-1 font-medium rounded-lg cursor-pointer transition-colors group ${theme === 'dark' ? 'text-white' : 'text-black'}`
    )}>
      <Link to={item.path} className="flex items-center gap-2 justify-items-center ml-2 rounded-lg ">
        {item.icon}
        <span className={`overflow-hidden transition-all justify-items-center rounded-lg font-semibold ${expanded ? "w-52 ml-1" : "w-0"}`}>
          {item.label}
        </span>
      </Link>
      {item.alert && (
        <div className={`absolute right-2 w-2 h-2 bg-indigo-400 rounded-lg ${expanded ? "" : "top-2"}`} />
      )}
      {!expanded && (
        <div className={`
          absolute left-full rounded-lg px-2 py-1 ml-6
          text-black text-sm 
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 ${theme === 'dark' ? 'text-gray-700 bg-indigo-300' : 'text-black bg-indigo-300'}
        `}>
          {item.label}
        </div>
      )}
    </li>
  );
}

function UserProfile({ user, theme }) {
  return (
    <div>
      <div className="h-24 w-24 rounded-full bg-cover bg-no-repeat bg-center mx-auto">
        {user.profile_image_url ? (
          <img src={user.profile_image_url} alt="Profile" className="w-24 h-24 rounded-full object-cover p-1 ring-2 ring-gray-200" />
        ) : (
          <div className={`flex items-center justify-center text-white mb-2 h-24 w-24 rounded-full bg-cover bg-no-repeat bg-center ${theme === 'dark' ? 'bg-gray-900 text-white ' : 'bg-slate-100 text-black '}`}>
            No Image
          </div>
        )}
      </div>
      <div className="flex justify-between overflow-hidden transition-all w-52 ml-18 rounded-lg">
        <div className="leading-4 text-center mx-auto">
          <h4 className="font-semibold w-full mt-4 rounded-lg">
            {user.first_name} {user.last_name}
          </h4>
          <span className="font-lg text-semibold text-xs text-center leading-6 text-gray-600">
            {user.email}
          </span>
        </div>
      </div>
    </div>
  );
}
