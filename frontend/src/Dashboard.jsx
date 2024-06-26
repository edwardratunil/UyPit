import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './App';
import moment from 'moment';
import { Ellipsis } from "lucide-react";
import axiosInstance from './axiosConfig';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const Dashboard = ({ isOpen }) => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [editingPostId, setEditingPostId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [commentContent, setCommentContent] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState('');
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [openPostDropdowns, setOpenPostDropdowns] = useState({});
  const [openCommentDropdowns, setOpenCommentDropdowns] = useState({});

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const authToken = localStorage.getItem('authToken');

    if (storedUser && authToken) {
      setUser(JSON.parse(storedUser));
      fetchPosts(authToken, 1);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchPosts = async (authToken, page) => {
    try {
      const response = await axiosInstance.get(`/posts?page=${page}&per_page=5`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (response.data.data.length > 0) {
        setPosts(prevPosts => {
          const newPosts = response.data.data.filter(post => !prevPosts.some(existingPost => existingPost.id === post.id));
          return [...prevPosts, ...newPosts];
        });
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const lastPostElementRef = useCallback(node => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [hasMore]);

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (authToken && page > 1) {
      fetchPosts(authToken, page);
    }
  }, [page]);

  const handleContentChange = (e) => setContent(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const authToken = localStorage.getItem('authToken');

    try {
      const response = await axiosInstance.post(
        '/posts',
        { content },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setPosts([response.data, ...posts]);
      setContent('');
    } catch (error) {
      console.error('Error creating post:', error);
      setError('Failed to create post. Please try again.');
    }
  };

  const handleEdit = (postId, currentContent) => {
    setEditingPostId(postId);
    setEditContent(currentContent);
  };

  const handleEditContentChange = (e) => setEditContent(e.target.value);

  const handleUpdate = async (postId) => {
    const authToken = localStorage.getItem('authToken');

    try {
      const response = await axiosInstance.put(
        `/posts/${postId}`,
        { content: editContent },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setPosts(posts.map(post =>
        post.id === postId ? { ...response.data, comments: post.comments } : post
      ));

      setEditingPostId(null);
      setEditContent('');
    } catch (error) {
      console.error('Error updating post:', error);
      setError('Failed to update post. Please try again.');
    }
  };

  const handleCancel = () => {
    setEditingPostId(null);
    setEditContent('');
  };

  const handleDelete = async (postId) => {
    const authToken = localStorage.getItem('authToken');

    try {
      await axiosInstance.delete(`/posts/${postId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleCommentChange = (e, postId) => {
    setCommentContent({ ...commentContent, [postId]: e.target.value });
  };

  const handleSubmitComment = async (postId) => {
    const authToken = localStorage.getItem('authToken');

    try {
      const response = await axiosInstance.post(
        `/posts/${postId}/comments`,
        { content: commentContent[postId] },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setPosts(posts.map(post =>
        post.id === postId ? { ...post, comments: [...(post.comments || []), response.data] } : post
      ));
      setCommentContent({ ...commentContent, [postId]: '' });
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('Failed to add comment. Please try again.');
    }
  };

  const handleEditComment = (commentId, currentContent) => {
    setEditingCommentId(commentId);
    setEditCommentContent(currentContent);
  };

  const handleEditCommentContentChange = (e) => setEditCommentContent(e.target.value);

  const handleUpdateComment = async (commentId, postId) => {
    const authToken = localStorage.getItem('authToken');

    try {
      const response = await axiosInstance.put(
        `/comments/${commentId}`,
        { content: editCommentContent },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const updatedComment = {
        ...response.data,
        user: posts.find(post => post.id === postId).comments.find(comment => comment.id === commentId).user,
        created_at: posts.find(post => post.id === postId).comments.find(comment => comment.id === commentId).created_at,
      };
      setPosts(posts.map(post =>
        post.id === postId ? {
          ...post,
          comments: post.comments.map(comment =>
            comment.id === commentId ? updatedComment : comment
          )
        } : post
      ));
      setEditingCommentId(null);
      setEditCommentContent('');
    } catch (error) {
      console.error('Error updating comment:', error);
      setError('Failed to update comment. Please try again.');
    }
  };

  const handleCancelComment = () => {
    setEditingCommentId(null);
    setEditCommentContent('');
  };

  const handleDeleteComment = async (commentId, postId) => {
    const authToken = localStorage.getItem('authToken');

    try {
      await axiosInstance.delete(`/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setPosts(posts.map(post =>
        post.id === postId ? {
          ...post,
          comments: post.comments.filter(comment => comment.id !== commentId)
        } : post
      ));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleLike = async (postId) => {
    const authToken = localStorage.getItem('authToken');

    try {
      const response = await axiosInstance.post(
        `/posts/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setPosts(posts.map(post =>
        post.id === postId ? { ...post, likes_count: response.data.likes_count, liked: response.data.liked } : post
      ));
    } catch (error) {
      console.error('Error liking/unliking post:', error);
      setError('Failed to like/unlike post. Please try again.');
    }
  };

  const togglePostDropdown = (postId) => {
    setOpenPostDropdowns((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const toggleCommentDropdown = (commentId) => {
    setOpenCommentDropdowns((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const closeDropdowns = (e) => {
    setOpenPostDropdowns({});
    setOpenCommentDropdowns({});
  };

  useEffect(() => {
    document.addEventListener('click', closeDropdowns);
    return () => {
      document.removeEventListener('click', closeDropdowns);
    };
  }, []);

  if (!user) {
    return <div></div>;
  }

  return (
    <HelmetProvider>
      <Helmet>
        <title>Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=0.50, maximum-scale=1.0, user-scalable=yes" />
      </Helmet>
      
      <div className={`flex flex-row h-[91vh] overflow-auto bg-white-100 justify-center  ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
        <div className="col-span-2 space-y-4 w-[50rem]">
          <div className="md:col-span-2 space-y-4 w-full md:w-[50rem]">
            <div className={`justify-center flex ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
              <form onSubmit={handleSubmit} className={`mb-4 space-y-4 w-full md:w-[40rem] ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
                <div className={`flex items-start -mt-14 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
                  <div className="flex-grow mt-20">
                    <div className="">
                      <textarea
                        placeholder="What's on your mind?"
                        value={content}
                        onChange={handleContentChange}
                        rows="3"
                        className={`py-2 px-4 w-full rounded-xl focus:ring-1 focus:ring-indigo-500 border-stroke text-dark placeholder-dark-6 outline-none placeholder-gray-500 text-sm focus:outline-none active:outline-none border border-gray-300 ${theme === 'dark' ? 'bg-gray-800 border-gray-600 text-white' : 'bg-gray-100 text-black border-gray-300'} rounded-md focus:ring-2 focus:ring-indigo-500`}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-2">
                  <button
                    type="submit"
                    className="transition duration-200 p-2 bg-indigo-500 hover:bg-indigo-600 inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-center text-base font-medium text-white"
                  >
                    Post
                  </button>
                </div>
              </form>
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            


            <div className="space-y-4">
              {posts.map((post, index) => (
                <div key={post.id} ref={index === posts.length - 1 ? lastPostElementRef : null} className={`mb-4 p-4 rounded-xl mt-6 ml-15 mx-auto w-full md:w-[40rem] shadow-md ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}>
                  <div className="items-center mb-2 flex mt-18">
                    {post.user.profile_image_url ? (
                      <img src={post.user.profile_image_url} alt="Profile" className="w-10 h-10 rounded-full mr-4" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-500 mr-4">
                        No Image
                      </div>
                    )}
                    <div className="text-sm mb-5">
                      <p className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-black'}`}> {post.user.first_name} {post.user.last_name}</p> 
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-50' : 'text-gray-500'}`}> {moment(post.created_at).format('MMMM Do YYYY @ h:mm A')}</p>
                    </div>
                    <div className="flex space-x-2 ml-auto relative">
                      {user && post.user_id === user.id && (
                        <button 
                          className={`post-date text-gray-600 cursor-pointer font-medium rounded-lg text-sm px-1 py-1 text-center inline-flex items-center ${theme === 'dark' ? ' text-white' : ' text-black'}`}
                          onClick={(e) => { e.stopPropagation(); togglePostDropdown(post.id); }}
                        >
                          <Ellipsis />
                        </button>
                      )}
                      {openPostDropdowns[post.id] && (
                        <div className="absolute top-full left-0 bg-white border border-gray-300 rounded-lg w-28 flex py-2">
                          <ul className="text-sm text-gray-700 dark:text-gray-500 w-28 items-center">
                            <li>
                              <a href="#" onClick={() => handleEdit(post.id, post.content)} className="px-2 py-2 hover:bg-gray-200 dark:hover:text-gray p-2 flex items-center mb-2 relative">
                                Edit
                              </a>
                            </li>
                            <li>
                              <a href="#" onClick={() => handleDelete(post.id)} className="px-2 py-2 hover:bg-gray-200 dark:hover:text-gray p-2 flex items-center mb-2 relative">
                                Delete
                              </a>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  {editingPostId === post.id ? (
                    <div>
                      <input
                        value={editContent}
                        onChange={handleEditContentChange}
                        className={`w-full h-20 px-3 py-2 ${theme === 'dark' ? 'bg-gray-700 border border-gray-600' : 'bg-gray-200 border border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                      />
                      <div className="flex space-x-2 mt-2">
                        <button
                          onClick={() => handleUpdate(post.id)}
                          className="mt-3 py-2 px-3 text-xs bg-indigo-600 hover:bg-indigo-700 rounded-xl transition duration-200 text-white"
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
                  <div className="mt-4 space-y-2">
                    {(post.comments || []).map((comment) => (
                      <div key={comment.id} className={`p-2 comment border-t border-gray-500${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-xl`}>
                        <div className="flex items-center">
                          {comment.user.profile_image_url ? (
                            <img src={comment.user.profile_image_url} alt="Profile" className="w-8 h-8 rounded-full mr-4" />
                          ) : (
                            <div className="w-8 h-8 ml-12 rounded-full bg-gray-700 flex items-center justify-center text-gray-500 mr-4">
                              No Image
                            </div>
                          )}
                          <div className="text-sm">
                            <p className="font-bold text-base"> {comment.user.first_name} {comment.user.last_name}</p> 
                            <p className="text-gray-500 text-xs"> {moment(comment.created_at).fromNow()}</p>
                          </div>
                          <div className="flex space-x-2 ml-auto relative">
                            {user && comment.user_id === user.id && (
                              <button 
                              className={`post-date text-gray-600 cursor-pointer font-medium rounded-lg text-sm px-1 py-1 text-center inline-flex items-center ${theme === 'dark' ? ' text-white' : ' text-black'}`}
                              onClick={(e) => { e.stopPropagation(); toggleCommentDropdown(comment.id); }}
                              >
                                <Ellipsis />
                              </button>
                            )}
                            {openCommentDropdowns[comment.id] && (
                              <div className="absolute top-full left-0 bg-white border border-gray-300 rounded-xl w-28 flex py-2">
                                <ul className="text-sm text-gray-700 dark:text-gray-500 w-28 items-center">
                                  <li>
                                    <a href="#" onClick={() => handleEditComment(comment.id, comment.content)} className="px-2 py-2 hover:bg-gray-200 dark:hover:text-gray p-2 flex items-center mb-2 relative">
                                      Edit
                                    </a>
                                  </li>
                                  <li>
                                    <a href='#' onClick={() => handleDeleteComment(comment.id, post.id)} className="px-2 py-2 hover:bg-gray-200 dark:hover:text-gray p-2 flex items-center mb-2 relative">
                                      Delete
                                    </a>
                                  </li>
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                        {editingCommentId === comment.id ? (
                          <>
                            <input
                              value={editCommentContent}
                              onChange={handleEditCommentContentChange}
                              className={`w-full px-3 py-2 ${theme === 'dark' ? 'bg-gray-700 border border-gray-600' : 'bg-gray-200 border border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-2`}
                            />
                            <div className="flex space-x-2 mt-2">
                              <button
                                onClick={() => handleUpdateComment(comment.id, post.id)}
                                className="mt-3 py-2 px-3 text-xs bg-indigo-600 hover:bg-indigo-700 rounded-xl transition duration-200 text-white"
                              >
                                Update
                              </button>
                              <button
                                onClick={handleCancelComment}
                                className="mt-3 py-2 px-3 text-xs bg-gray-600 hover:bg-gray-700 rounded-xl transition duration-200 text-white"
                              >
                                Cancel
                              </button>
                            </div>
                          </>
                        ) : (
                          <p className="mt-2 ml-10">{comment.content}</p>
                        )}
                      </div>
                    ))}
                    <div className="mt-4">
                      <form onSubmit={(e) => { e.preventDefault(); handleSubmitComment(post.id); }} className="flex items-center px-14">
                        <input
                          type="text"
                          placeholder="Add a comment..."
                          value={commentContent[post.id] || ''}
                          onChange={(e) => handleCommentChange(e, post.id)}
                          className={`py-1.5 rounded-xl justify-center px-32 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-primary bg-gray-200 placeholder:text-gray-500 pl-20 ${theme === 'dark' ? 'bg-gray-700 border border-gray-600' : 'bg-gray-200 border border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        />
                        <button
                          type="submit"
                          className="bg-indigo-500 hover:bg-indigo-600 ml-2 flex items-center justify-center rounded-xl bg-primary px-2 py-2 text-center text-base font-medium text-white"
                        >
                          Comment
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default Dashboard;
