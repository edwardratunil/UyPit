import React, { useState } from 'react';
import axiosInstance from './axiosConfig';
import Swal from 'sweetalert2';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const authToken = localStorage.getItem('authToken');
    const formData = new FormData();
    formData.append('title', title);
    if (file) {
      formData.append('file', file);
    }

    try {
      await axiosInstance.post('/posts', formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setTitle('');
      setFile(null);
      Swal.fire({
        icon: 'success',
        title: 'Post created successfully!',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      setError('Failed to create post. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-black">Create a New Post</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <select
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-black focus:ring-gray-500 mb-4"
        >
          <option value="">Select Category</option>
          <option value="Dress">Dress</option>
          <option value="Semi-Formal">Semi-Formal</option>
          <option value="Formal">Formal</option>
          <option value="Casual">Casual</option>
          <option value="Streetwear">Streetwear</option>
        </select>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 mb-4"
        />
        <button
          type="submit"
          className="w-full py-2 px-4 bg-gray-600 hover:bg-gray-700 rounded-md text-white transition duration-200"
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
