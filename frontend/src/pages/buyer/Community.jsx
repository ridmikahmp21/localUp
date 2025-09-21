import { useState } from "react";
import Navbar from "../../components/navbarBuyer/Navbar";
import HelpCenter from "../../components/HelpCenter";

const Community = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: {
        name: "Sarah Johnson",
        role: "Seller • Handmade Crafts",
        avatar: "SJ",
      },
      content:
        "Just finished setting up my booth at the Downtown Artisan Market! Come by this weekend for special discounts and live demonstrations.",
      image:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
      timestamp: "2 hours ago",
      likes: 24,
      comments: 5,
      shares: 3,
      userLiked: false,
    },
    {
      id: 2,
      user: {
        name: "Mike's Electronics",
        role: "Seller • Electronics",
        avatar: "ME",
      },
      content:
        "We're hosting a workshop on basic electronics repair this Saturday. Learn how to fix common issues with your devices! Limited spots available.",
      image:
        "https://images.unsplash.com/photo-1581094288338-231b058b38b8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
      timestamp: "5 hours ago",
      likes: 18,
      comments: 7,
      shares: 4,
      userLiked: true,
    },
    {
      id: 3,
      user: {
        name: "Local Food Co-op",
        role: "Buyer Group • Food Enthusiasts",
        avatar: "LF",
      },
      content:
        "Our monthly food tasting event was a huge success! Thanks to all the local producers who participated. Here are some photos from the event.",
      image:
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
      timestamp: "1 day ago",
      likes: 42,
      comments: 12,
      shares: 8,
      userLiked: false,
    },
  ]);

  const [newPost, setNewPost] = useState("");

  const handleLike = (postId) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            likes: post.userLiked ? post.likes - 1 : post.likes + 1,
            userLiked: !post.userLiked,
          };
        }
        return post;
      })
    );
  };

  const handleAddPost = () => {
    if (newPost.trim() === "") return;

    const user = {
      name: "Current User",
      role: "Buyer • Community Member",
      avatar: "CU",
    };

    const newPostObj = {
      id: posts.length + 1,
      user,
      content: newPost,
      image: null,
      timestamp: "Just now",
      likes: 0,
      comments: 0,
      shares: 0,
      userLiked: false,
    };

    setPosts([newPostObj, ...posts]);
    setNewPost("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      <div className="pt-20 pb-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Community Activities
            </h1>
            <p className="text-gray-600">
              Share events, workshops, and connect with other buyers and sellers
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white font-medium">
                CU
              </div>
              <div className="flex-1">
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Share an event, workshop, or community activity..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none"
                  rows="3"
                />
                <div className="flex justify-between items-center mt-3">
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                  <button
                    onClick={handleAddPost}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="p-5 border-b border-gray-100">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white font-medium">
                      {post.user.avatar}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {post.user.name}
                      </h3>
                      <p className="text-sm text-gray-600">{post.user.role}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-gray-800">{post.content}</p>
                </div>

                {post.image && (
                  <div className="w-full">
                    <img
                      src={post.image}
                      alt="Post content"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}

                <div className="px-5 py-3 border-b border-gray-100">
                  <div className="flex items-center text-sm text-gray-600 space-x-4">
                    <span>{post.likes} likes</span>
                    <span>{post.comments} comments</span>
                    <span>{post.shares} shares</span>
                  </div>
                </div>

                <div className="px-5 py-2 flex justify-between">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                      post.userLiked ? "text-red-500" : "text-gray-600"
                    } hover:bg-gray-100`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Like</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Comment</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                    </svg>
                    <span>Share</span>
                  </button>
                </div>
                <div className="px-5 py-3 bg-gray-50">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 text-xs font-medium">
                      CU
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Write a comment..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="px-5 py-2 bg-gray-50 border-t border-gray-100">
                  <p className="text-xs text-gray-500">{post.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <HelpCenter />
    </div>
  );
};

export default Community;
