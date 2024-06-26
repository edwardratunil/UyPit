// import {HiUserGroup, HiLogout } from 'react-icons/hi'
// import { RiUserSettingsFill } from "react-icons/ri";
// import { BiSolidMessageSquareDetail } from "react-icons/bi";
// import { RiDashboardHorizontalFill } from "react-icons/ri";
// import { RiProfileLine } from "react-icons/ri";
// import { MdNotificationsActive } from "react-icons/md";
// import { FaUser, FaUsers } from "react-icons/fa6";
// import { IoSettings } from "react-icons/io5";



// export const DASHBOARD_SIDEBAR_LINKS = [
// 	{
// 		key: 'dashboard',
// 		label: 'Dashboard',
// 		path: '/dashboard',
// 		icon: <RiDashboardHorizontalFill />
// 	},
// 	{
// 		key: 'profile',
// 		label: 'Profile',
// 		path: '/user-posts',
// 		icon: <FaUser />
// 	},
// 	{
// 		key: 'following',
// 		label: 'People',
// 		path: '/following',
// 		icon: <FaUsers />


// 	},
	
// 	// {
// 	// 	key: 'notification',
// 	// 	label: 'Notification',	
// 	// 	path: '/notification',
// 	// 	icon: <MdNotificationsActive />
// 	// },

// 	{
// 		key: 'messages',
// 		label: 'Messages',
// 		path: '/messages',
// 		icon: <BiSolidMessageSquareDetail />
// 	}


	
// 	/*{
// 		key: 'transactions',
// 		label: 'Transactions',
// 		path: '/transactions',
// 		icon: <HiOutlineDocumentText />
// 	},
// 	{
// 		key: 'student',
// 		label: 'Student',
// 		path: '/student',
// 		icon: <HiUserGroup />
// 	},
// 	{
// 		key: 'messages',
// 		label: 'Messages',
// 		path: '/messages',
// 		icon: <HiOutlineAnnotation />
// 	}*/
// ]

// export const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
// 	{
// 		key: 'settings',
// 		label: 'Settings',
// 		path: '/settings',
// 		icon: <IoSettings />

// 	},

// 	// {
// 	// 	key: 'logout',
// 	// 	label: 'Logout',
// 	// 	path: '/',
// 	// 	icon: <HiLogout />

// 	// }
// ]

// navigation.js
import { HiUserGroup, HiLogout } from 'react-icons/hi';
import { RiUserSettingsFill, RiDashboardHorizontalFill, RiProfileLine } from "react-icons/ri";
import { BiSolidMessageSquareDetail } from "react-icons/bi";
import { MdNotificationsActive } from "react-icons/md";
import { FaUser, FaUsers } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";

export const DASHBOARD_SIDEBAR_LINKS = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: <RiDashboardHorizontalFill />,
  },
  {
    key: 'profile',
    label: 'Profile',
    path: '/user-posts',
    icon: <FaUser />,
  },
  {
    key: 'following',
    label: 'People',
    path: '/following',
    icon: <FaUsers />,
  },
  {
    key: 'messages',
    label: 'Messages',
    path: '/messages',
    icon: <BiSolidMessageSquareDetail />,
  },
];

export const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
  {
    key: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: <IoSettings />,
  },
];

export const ADMIN_LINKS = [
  {
    key: 'admin-dashboard',
    label: 'Admin Dashboard',
    path: '/admin',
    icon: <RiUserSettingsFill />,
  },
];
