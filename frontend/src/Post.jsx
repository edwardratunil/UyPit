import React from 'react';
import moment from 'moment';
import { Ellipsis } from "lucide-react";

const Post = ({
  post,
  user,
  handleEdit,
  handleDelete,
  handleLike,
  togglePostDropdown,
  openPostDropdowns,
  editingPostId,
  editContent,
  handleEditContentChange,
  handleUpdate,
  handleCancel,
  lastPostElementRef
}) => (
  <div ref={lastPostElementRef} className="mb-4 p-4 rounded-xl mt-6 ml-15 mx-auto w-full md:w-[40rem] shadow-md bg-gray-200 text-black">
    <div className="items-center mb-2 flex mt-18">
      {post.user?.profile_image_url ? (
        <img src={post.user.profile_image_url} alt="Profile" className="w-10 h-10 rounded-full mr-4" />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-500 mr-4">
          No Image
        </div>
      )}
      <div className="text-sm mb-5">
        <p className="font-bold text-lg text-black">
          {post.user?.first_name} {post.user?.last_name}
        </p>
        <p className="text-xs text-gray-500">
          {moment(post.created_at).format('MMMM Do YYYY @ h:mm A')}
        </p>
      </div>
      <div className="flex space-x-2 ml-auto relative">
        {user && post.user_id === user.id && (
          <button
            className="post-date text-gray-600 cursor-pointer font-medium rounded-lg text-sm px-1 py-1 text-center inline-flex items-center"
            onClick={(e) => { e.stopPropagation(); togglePostDropdown(post.id); }}
          >
            <Ellipsis />
          </button>
        )}
        {openPostDropdowns[post.id] && (
          <div className="absolute top-full left-0 bg-white border border-gray-300 rounded-lg w-28 flex py-2">
            <ul className="text-sm text-gray-700 w-28 items-center">
              <li>
                <a href="#" onClick={() => handleDelete(post.id)} className="px-2 py-2 hover:bg-gray-200 p-2 flex items-center mb-2 relative">
                  Delete
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
    <h2 className="font-bold text-xl">{post.title}</h2>
    {post.image_url && (
      <img src={post.image_url} alt="Post" className="w-full h-auto mt-4" />
    )}
    {editingPostId === post.id ? (
      <div>
        <input
          value={editContent}
          onChange={handleEditContentChange}
          className="w-full h-20 px-3 py-2 bg-gray-200 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <div className="flex space-x-2 mt-2">
          <button
            onClick={() => handleUpdate(post.id)}
            className="mt-3 py-2 px-3 text-xs bg-gray-600 hover:bg-gray-700 rounded-xl transition duration-200 text-white"
          >
            Update
          </button>
          <button
            onClick={handleCancel}
            className="mt-3 py-2 px-3 text-xs bg-gray-600 hover:bg-gray-700 rounded-xl transition duration-200 text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    ) : (
      <p>{post.content}</p>
    )}
    <div className="flex space-x-2 mt-2">
      <button
        onClick={() => handleLike(post.id)}
        className={`rounded-xl text-white ${post.liked ? 'stroke-red-500 text-red-200 flex items-center' : 'flex items-center'}`}
      >
        {post.liked ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-10 fill-red-600 stroke-red-600 hover:bg-red-200 rounded-full px-2 py-1">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg> : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-10 stroke-gray-500 text-gray-200 hover:bg-gray-200 rounded-full px-2 py-1">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg>}
      </button>
      <span className="mt-2 -ml-64">{post.likes_count}{post.likes_count === 2 ? '' : ''}</span>
    </div>
  </div>
);

export default Post;
