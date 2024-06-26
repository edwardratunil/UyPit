import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from './App';
import moment from 'moment';
import { Ellipsis } from 'lucide-react';
import { FaArrowLeft } from "react-icons/fa";
import axiosInstance from './axiosConfig';
import { Helmet, HelmetProvider} from 'react-helmet-async';

const PostDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const [commentContent, setCommentContent] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState('');
  const [editingPost, setEditingPost] = useState(false);
  const [editPostContent, setEditPostContent] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [openPostDropdowns, setOpenPostDropdowns] = useState({});
  const [openCommentDropdowns, setOpenCommentDropdowns] = useState({});

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const authToken = localStorage.getItem('authToken');
    if (storedUser && authToken) {
      setUser(JSON.parse(storedUser));
      fetchPost(authToken);
    } else {
      navigate('/login');
    }
  }, [navigate, postId]);

  const fetchPost = async (authToken) => {
    try {
      const response = await axiosInstance.get(`/posts/${postId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setPost(response.data);
    } catch (error) {
      console.error('Error fetching post:', error);
      setError('Failed to fetch post. Please try again.');
    }
  };

  const handleEditPost = () => {
    setEditingPost(true);
    setEditPostContent(post.content);
  };

  const handleEditPostContentChange = (e) => setEditPostContent(e.target.value);

  const handleUpdatePost = async () => {
    const authToken = localStorage.getItem('authToken');
    try {
      const response = await axiosInstance.put(
        `/posts/${postId}`,
        { content: editPostContent },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setPost(prevPost => ({
        ...prevPost,
        content: response.data.content, // Update the post content
      }));
      setEditingPost(false);
      setEditPostContent('');
    } catch (error) {
      console.error('Error updating post:', error);
      setError('Failed to update post. Please try again.');
    }
  };

  const handleCancelPostEdit = () => {
    setEditingPost(false);
    setEditPostContent('');
  };

  const handleDeletePost = async () => {
    const authToken = localStorage.getItem('authToken');
    try {
      await axiosInstance.delete(`/posts/${postId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error deleting post:', error);
      setError('Failed to delete post. Please try again.');
    }
  };

  const handleCommentChange = (e) => setCommentContent(e.target.value);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    const authToken = localStorage.getItem('authToken');
    try {
      const response = await axiosInstance.post(
        `/posts/${postId}/comments`,
        { content: commentContent },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setPost(prevPost => ({ ...prevPost, comments: [...prevPost.comments, response.data] }));
      setCommentContent('');
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

  const handleUpdateComment = async (commentId) => {
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
      const updatedComment = response.data;
      const originalComment = post.comments.find(comment => comment.id === commentId);
      setPost(prevPost => ({
        ...prevPost,
        comments: prevPost.comments.map(comment =>
          comment.id === commentId ? { ...updatedComment, user: originalComment.user, created_at: originalComment.created_at } : comment
        ),
      }));
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

  const handleDeleteComment = async (commentId) => {
    const authToken = localStorage.getItem('authToken');
    try {
      await axiosInstance.delete(`/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setPost(prevPost => ({
        ...prevPost,
        comments: prevPost.comments.filter(comment => comment.id !== commentId),
      }));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleLike = async () => {
    const authToken = localStorage.getItem('authToken');
    try {
      const response = await axiosInstance.post(
        `/posts/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setPost(prevPost => ({
        ...prevPost,
        likes_count: response.data.likes_count,
        liked: response.data.liked,
      }));
    } catch (error) {
      console.error('Error liking/unliking post:', error);
      setError('Failed to like/unlike post. Please try again.');
    }
  };

  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
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

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <HelmetProvider>
      <Helmet>
      <title>View Posts</title>
      <meta name="viewport" content="width=device-width, initial-scale=0.50, maximum-scale=1.0, user-scalable=yes" />
      </Helmet>
 
    <button
      onClick={handleBack}
      className={`flex items-center mb-4 mt-2 ml-4 py-2 px-2 rounded-full  ${theme === 'dark' ? 'bg-gray-900 text-white hover:bg-gray-800' : 'bg-white text-black hover:bg-gray-200'}`}
    >
      <FaArrowLeft className=" text-gray-400 w-5 h-5" />
    </button>
      {/* <button
        onClick={handleBack}
        className="mb-0 mt-2 ml-4 py-2 px-4   text-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`size-6 fill-gray-700 ${theme === 'dark' ? 'fill-gray-500 hover:fill-gray-200 ' : 'fill-gray-500 hover:fill-gray-800'}`}>
          <path fillRule="evenodd" d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
        </svg>

      </button> */}

      <div className={`flex-1 flex flex-col mt-0 overflow-y-auto ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <div className="flex flex-row  justify-center">
      <div className="col-span-2 w-[50rem]">
      <div className={` justify-center flex ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>


          <div>
            <div className={` p-4 rounded-xl mx-auto w-[40rem] shadow-md ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}>
        
              <div className="items-center mb-2 flex mt-1">
                {post.user.profile_image_url ? (
                  <img src={post.user.profile_image_url} alt="Profile" className="w-10 h-10 rounded-xl mr-4" />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-gray-700 flex items-center justify-center text-gray-500 mr-4">
                    No Image
                  </div>
                )}
                <div className="text-sm mb-5">
                  <p className={`font-bold text-lg	${theme === 'dark' ? ' text-white' : ' text-black'}`}> {post.user.first_name} {post.user.last_name}</p> 
                  <p className={`text-xs		${theme === 'dark' ? ' text-gray-50' : ' text-gray-500'}`}> {moment(post.created_at).format('MMMM Do YYYY @ h:mm A')}</p>
                </div>

                <div className=" flex space-x-2 ml-auto relative">
                {post.user_id === user.id && !editingPost && (

                <button 
                className={`post-date text-gray-600 cursor-pointer font-medium rounded-lg text-sm px-1 py-1 text-center inline-flex items-center ${theme === 'dark' ? ' text-white' : ' text-black'}`}
                onClick={(e) => { e.stopPropagation(); togglePostDropdown(post.id); }}
                    >
                      <Ellipsis />
                    </button>
                )}
                    {openPostDropdowns[post.id] && (
                      <div className=" absolute top-full left-0 bg-white border border-gray-300 rounded-lg w-28 flex py-2">
                
                    <ul className="text-sm text-gray-700 dark:text-gray-500 w-28 items-center ">
                      <li>
                        <a href='#'
                    onClick={handleEditPost}
                    className="px-2 py-2 hover:bg-gray-200 dark:hover:text-gray p-2 flex items-center mb-2 relative"
                  >
                    Edit
                  </a>
                  </li>
                  <li>
                  <a href='#'
                    onClick={handleDeletePost}
                    className="px-2 py-2 hover:bg-gray-200 dark:hover:text-gray p-2 flex items-center mb-2 relative"
                  >
                    Delete
                  </a>
                  </li>
                  </ul>
                  </div>

              )}
                    
                    </div>
                    </div>
            {editingPost ? (
              <div>
                <input
                  value={editPostContent}
                  onChange={handleEditPostContentChange}
                  className={`w-full h-32 px-3 py-2 ${theme === 'dark' ? 'bg-gray-700 border border-gray-600' : 'bg-gray-200 border border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={handleUpdatePost}
                    className="mt-3 py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md transition duration-200 text-white"
                  >
                    Update
                  </button>
                  <button
                    onClick={handleCancelPostEdit}
                    className="mt-3 py-2 px-4 bg-gray-600 hover:bg-gray-700 rounded-md transition duration-200 text-white"
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
                onClick={handleLike}
                className={`rounded-xl text-white ${post.liked ? 'stroke-red-500 text-red-200 flex items-center ' : 'flex items-center'}`}
              >
                {post.liked ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-10 fill-red-600 stroke-red-600 hover:bg-red-200 rounded-full px-2 py-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg> : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-10 stroke-gray-500 text-gray-200 hover:bg-gray-200 rounded-full px-2 py-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>}
              </button>
              <span className="mt-2 -ml-64">{post.likes_count} {post.likes_count === 2 ? '' : ''}</span>
            </div>
            <div className="mt-4 space-y-2">
              {(post.comments || []).map((comment) => (
                <div key={comment.id} className={`p-2 comment border-t border-gray-500${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-md`}>
                    <div className="flex items-center">
                      {comment.user.profile_image_url ? (
                        <img src={comment.user.profile_image_url} alt="Profile" className="w-8 h-8 rounded-xl mr-4" />
                      ) : (
                        <div className="w-8 h-8 rounded-xl bg-gray-700 flex items-center justify-center text-gray-500 mr-4">
                          No Image
                        </div>
                      )}
                      <div className="text-sm">
                        <p className="font-bold text-base	"> {comment.user.first_name} {comment.user.last_name}</p> 
                        <p className="text-gray-500 text-xs "> {moment(comment.created_at).fromNow()}</p>
                      </div>
                      <div className=" flex space-x-2 ml-auto relative ">
                      {/* {openCommentDropdowns[comment.id] && ( */}

                      {comment.user_id === user.id && editingCommentId !== comment.id && (

                      <button 
                      className={`post-date text-gray-600 cursor-pointer font-medium rounded-lg text-sm px-1 py-1 text-center inline-flex items-center ${theme === 'dark' ? ' text-white' : ' text-black'}`}
                      onClick={(e) => { e.stopPropagation(); toggleCommentDropdown(comment.id); }}
                    >
                      <Ellipsis />
                    </button>
                      )}
                      {openCommentDropdowns[comment.id] && (

                      <div className=" absolute top-full left-0 bg-white border border-gray-300 rounded-lg w-28 flex py-2">
                        <ul className="text-sm text-gray-700 dark:text-gray-500 w-28 items-center ">
                          <li>
                            <a href="#" onClick={() => handleEditComment(comment.id, comment.content)} className=" px-2 py-2 hover:bg-gray-200 dark:hover:text-gray p-2 flex items-center mb-2 relative">

                              Edit
                            </a>
                          </li>
                          <li>
                            <a href="#"  onClick={() => handleDeleteComment(comment.id, post.id)} className=" px-2 py-2 hover:bg-gray-200 dark:hover:text-gray p-2 flex items-center mb-2 relative">
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
                        className={`w-full h-20 px-3 py-2 ${theme === 'dark' ? 'bg-gray-700 border border-gray-600' : 'bg-gray-200 border border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2`}
                      />
                      <div className="flex space-x-2 mt-2">
                        <button
                          onClick={() => handleUpdateComment(comment.id)}
                          className="py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md transition duration-200 text-white"
                        >
                          Update
                        </button>
                        <button
                          onClick={handleCancelComment}
                          className="py-2 px-4 bg-gray-600 hover:bg-gray-700 rounded-md transition duration-200 text-white"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <p className="mt-2">{comment.content}</p>
                  )}
                </div>
              ))}

              <div className="mt-4">
                <form onSubmit={handleSubmitComment} className="flex items-center px-14">
                  <input
                    placeholder="Add a comment..."
                    value={commentContent}
                    onChange={handleCommentChange}
                    className={`py-1.5 rounded-lg justify-center px-32 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-primary bg-gray-200 text-gray-700 placeholder:text-gray-500 pl-20${theme === 'dark' ? 'bg-gray-700 border border-gray-600' : 'bg-gray-200 border border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
      </div>
    </div>
    </div>
    </div>
    </HelmetProvider>
  );
};

export default PostDetail;