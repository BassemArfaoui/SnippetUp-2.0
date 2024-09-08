import React, { useState, useEffect } from 'react';
import './styles/Feed.css';
import Post from '../parts/Post';
import axios from 'axios';

function FeedSide() {
  // State to hold posts data
  const [posts, setPosts] = useState([]);

  // Fetch posts from the API on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:4000/posts');
        console.log(response.data);
        setPosts(response.data); // Assuming the response contains an array of posts
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []); // Empty dependency array ensures it runs only once after mount

  return (
    <div className="col-lg-12 p-0 ">
      <div className="feed-side d-flex flex-column gap-2">
        <div className="pt-3"></div>
        {posts.map((post) => (
          <Post
            key={post.id} // Use a unique key for each post (assuming `id` is unique)
            title={post.title}
            snippet={post.snippet}
            description={post.description}
            posterId={post.poster_id}
            language={post.language}
            likeCount={post.like_count}
            dislikeCount={post.dislike_count}
            commentCount={post.comment_count}
            shareCount={post.share_count}
          />
        ))}
      </div>
    </div>
  );
}

export default FeedSide;
