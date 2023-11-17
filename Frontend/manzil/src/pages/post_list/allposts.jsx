import React, { useState } from 'react';
import './allpost.css'

function PostListing({post}){
// const posts={post}
// console.log("posts:",posts)
  return (
    <div className='center-container '>
      {/* Post create option at the top */}
      <div>
        <textarea
          placeholder="What's on your mind?"
        //   value={newPostContent}
        //   onChange={(e) => setNewPostContent(e.target.value)}
        />
        <button >Post</button>
      </div>

      {/* List of posts */}
      <div>
        {post.map((post,index) => (
          <div key={post.id}>
           {post.media && <img src={post.media} alt="Post" />}
            <p>{post.caption}</p>
            
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostListing;
