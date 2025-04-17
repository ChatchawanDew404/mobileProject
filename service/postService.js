import { supabase } from "../lib/supabase";
import { uploadFile } from "./imageService";

//-------------------------------------------------------------
//                               [POST]
// -------------------------------------------------------------
//------------------------- create Post
export const createOrUpdatePost = async (post) => {
  try {
    // upload image or video
    if (post.file && typeof post.file === 'object') {
      let isImage = post.file?.type == 'image';
      let folderName = isImage ? 'postImages' : 'postVideos';
      let fileResult = await uploadFile(folderName, post?.file?.uri, isImage);
      if (fileResult.success) post.file = fileResult.data;
      else{
        return fileResult;
      }
    }

    const { data, error } = await supabase
    .from('posts')
    .upsert(post)
    .select()
    .single();

  if (error) {
    console.log('createPost error: ', error);
    return { success: false, msg: 'Could not create your post' };
  }

  return { success: true, data: data };


  } catch (error) {
    console.log('createPost error: ', error);
    return { success: false, msg: 'Could not create your post' };
  }
};

// get all post and show in homepage (สำรอง)
// export const fetchPosts = async (limit = 10) => {
//   try {
//     const { data, error } = await supabase
//       .from('posts')
//       .select(`* , user:users(id,name,image)`)
//       .order('created_at', { ascending: false })
//       .limit(limit);

//     if (error) {
//       console.log('fetchPosts error: ', error);
//       return { success: false, msg: 'Could not fetch the posts' };
//     }

//     return { success: true, data: data };

//   } catch (error) {
//     console.log('fetchPosts error: ', error);
//     return { success: false, msg: 'Could not fetch the posts' };
//   }
// };


// ---------------------- Get All Post
// get  et all post  (home page) 
export const fetchPosts = async (limit = 10 , userId) => {
  try {
      if(userId){
        const { data, error } = await supabase
        .from('posts')
        .select(`* , user:users(id,name,image) , postLikes (*) , comments (count)`)
        .eq('userId', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
  
      if (error) {
        console.log('fetchPosts error: ', error);
        return { success: false, msg: 'Could not fetch the posts' };
      }
  
      return { success: true, data: data };
      }else{
        const { data, error } = await supabase
        .from('posts')
        .select(`* , user:users(id,name,image) , postLikes (*) , comments (count)`)
        .order('created_at', { ascending: false })
        .limit(limit);
  
      if (error) {
        console.log('fetchPosts error: ', error);
        return { success: false, msg: 'Could not fetch the posts' };
      }
  
      return { success: true, data: data };
  
      }
  } catch (error) {
    console.log('fetchPosts error: ', error);
    return { success: false, msg: 'Could not fetch the posts' };
  }
};

// get post details (postDetail page)
export const fetchPostsDetails = async (postId) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select(`* , user:users(id,name,image) , postLikes (*) , comments (*,user:users(id,name,image))`)
      .order('created_at' , {ascending:false , foreignTable:'comments'})
      .eq('id' , postId)
      .single();

    if (error) {
      console.log('fetchPostDetails error: ', error);
      return { success: false, msg: 'Could not fetch the posts' };
    }

    return { success: true, data: data };

  } catch (error) {
    console.log('fetchPostDetails error: ', error);
    return { success: false, msg: 'Could not fetch the posts' };
  }
};

// ---------- Edit Post

// ---------- Delete Post
export const removePost = async (postId) => {
  try {
    const {data,error} = await supabase
    .from('posts')
    .delete()
    .eq('id',postId)
    
    if (error) {
      console.log('removePost error: ', error);
      return { success: false, msg: 'Could not remove the post post' };
    }

    return { success: true, data: data };

  } catch (error) {
    console.log('removePost error: ', error);
    return { success: false, msg: 'Could not remove the post post' };
  }
};


//-------------------------------------------------------------
//                              [LIKES] 
// -------------------------------------------------------------
// get Likes
export const createPostLike = async (postLike) => {
  try {
    const {data,error} = await supabase
    .from('postLikes')
    .insert(postLike)
    .select()
    .single()
    
    if (error) {
      console.log('fetchPosts error: ', error);
      return { success: false, msg: 'Could not like the posts' };
    }

    return { success: true, data: data };

  } catch (error) {
    console.log('Postlike error: ', error);
    return { success: false, msg: 'Could not like the posts' };
  }
};
// remove like
export const removePostLike = async (postId , userId) => {
  try {
    const {data,error} = await supabase
    .from('postLikes')
    .delete()
    .eq('userId',userId)
    .eq('postId',postId)
    
    if (error) {
      console.log('fetchPosts error: ', error);
      return { success: false, msg: 'Could not remove the post like' };
    }

    return { success: true, data: data };

  } catch (error) {
    console.log('Postlike error: ', error);
    return { success: false, msg: 'Could not remove the post like' };
  }
};



//------------------------------------------------------------
//                              [COMMENT] 
// -----------------------------------------------------------

//  get Comment
export const createComment = async (comment) => {
  try {
    const {data,error} = await supabase
    .from('comments')
    .insert(comment)
    .select()
    .single()
    
    if (error) {
      console.log('Comment error: ', error);
      return { success: false, msg: 'Could not like the posts' };
    }

    return { success: true, data: data };

  } catch (error) {
    console.log('COmment error: ', error);
    return { success: false, msg: 'Could not like the posts' };
  }
};

//  delete comment
export const removePostComment = async (commentId) => {
  try {
    const {data,error} = await supabase
    .from('comments')
    .delete()
    .eq('id',commentId)
    
    if (error) {
      console.log('removeComment error: ', error);
      return { success: false, msg: 'Could not remove the post comment' };
    }

    return { success: true, data: data };

  } catch (error) {
    console.log('removeComment error: ', error);
    return { success: false, msg: 'Could not remove the post comment' };
  }
};