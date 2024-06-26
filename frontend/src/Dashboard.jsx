import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from './axiosConfig';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Post from './Post';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const navigate = useNavigate();
  const [openPostDropdowns, setOpenPostDropdowns] = useState({});

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

  const closeDropdowns = (e) => {
    setOpenPostDropdowns({});
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

      <div className="flex flex-row h-[91vh] overflow-auto bg-white-100 justify-center">
        <div className="col-span-2 space-y-4 w-[50rem]">
          <div className="md:col-span-2 space-y-4 w-full md:w-[50rem]">
            <div className="space-y-4">
              {posts.map((post, index) => (
                <Post
                  key={post.id}
                  post={post}
                  user={user}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                  handleLike={handleLike}
                  togglePostDropdown={togglePostDropdown}
                  openPostDropdowns={openPostDropdowns}
                  editingPostId={editingPostId}
                  editContent={editContent}
                  handleEditContentChange={handleEditContentChange}
                  handleUpdate={handleUpdate}
                  handleCancel={handleCancel}
                  lastPostElementRef={index === posts.length - 1 ? lastPostElementRef : null}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default Dashboard;
