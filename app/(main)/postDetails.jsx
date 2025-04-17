import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React , {useEffect , useRef, useState} from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { createComment, fetchPostsDetails, removePost, removePostComment } from '../../service/postService'
import { theme } from '../../constants/theme'
import { heightPercent, widthPercent } from '../../helpers/common'
import PostCard from '../../components/PostCard'
import { useAuth } from '../../contexts/AuthContext'
import Header from '../../components/Header'
import Loading from '../../components/Loading'
import Input from '../../components/Input'
import Feather from '@expo/vector-icons/Feather';
import { Alert } from 'react-native'
import CommentItem from '../../components/CommentItem'
import { supabase } from '../../lib/supabase'
import { getUserData } from '../../service/userService'
import BackButton from '../../components/BackButton'
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const postDetails = () => {
    const {postId} = useLocalSearchParams()
    const {user} = useAuth()
    const router = useRouter()
    const [startLoading , setStartLoading] = useState(true)
    const [post , setPost] = useState(null);
    const inputRef = useRef(null)
    const commentRef = useRef('')
    const [loading , setLoading] = useState(false)

    useEffect(() =>{
      getPostDetails()
      },[])

      useFocusEffect(
        useCallback(() => {
          getPostDetails()
        }, [])
      );

    const getPostDetails = async() =>{
        let res = await fetchPostsDetails(postId)
        if(res.success){setPost(res.data)}
        setStartLoading(false)
    }

    if(startLoading){
        return(
            <View style={styles.center}>
                 <Loading/>
            </View>
        )
    }

    if(!post){
        return(
            <View style={[styles.center , {justifyContent:'flex-start' , marginTop:100}]}>
                 <Text style={styles.notFound}>Post not found</Text>
            </View>
        )
    }

    const onNewComment = async()=>{
          if(commentRef.current == ''){
            Alert.alert('Comment' , "please enter your comment")
            return;
          } 
           else{
            let data = {
                userId:user?.id,
                postId:post?.id,
                text:commentRef.current
              }
    
              setLoading(true)
              let res = await createComment(data)
              setLoading(false)
              if(res.success){
                           inputRef?.current?.clear()
                           commentRef.current = ''
                           Alert.alert('Comment' , "Your comment has been added successfully.")
                           getPostDetails()
              }else{
                Alert.alert('COmment' , res.msg)
              }
          }
    }

    // delete comment function
    const onDeleteComment = async(comment) =>{
        let res = await removePostComment(comment?.id)
        if(res.success){
            setPost(prevPost=>{
                let updatePost = {...prevPost};
                updatePost.comments = updatePost.comments.filter(c=> c.id != comment.id)
                return updatePost
            })
        }else{
            Alert.alert('Comment' , res.msg)
        }
    }

    // Edit Post
    const onEditPost = async(item) =>{
            router.push({pathname:'newPost' , params:{...item} ,reloadPost:getPostDetails()})
    }

    // Delete Post
    const onDeletePost = async(item) =>{
        let res = await removePost(post.id);
        if(res.success){
          router.back()
        }else{
          Alert.alert("Post" , res.msg)
        }
    }

  return (
    <View style={styles.container}>
        <View style={{marginLeft:15}}>
        <Header title="Comment Post" mb={30}/>
        </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
<PostCard item={{...post , comments:[{count:post.comments.length}] }} currentUser={user} router={router} hasShadow={false} showMoreIcon={false} showDelete={true} onDelete={onDeletePost} onEdit={onEditPost}/>

<View style={styles.inputContainer}>
  <Input
  inputRef={inputRef}
  onChangeText={value => commentRef.current = value}
    placeholder="Type comment..."
    placeholderTextColor={theme.colors.textLight}
    containerStyle={{ flex: 1, height: heightPercent(6.2), borderRadius:theme.radius.xl }}  style={{width:'80%'}}
  />

  {loading ? (
    <View><Loading/></View>
  ) : (
    <TouchableOpacity style={styles.sendIcon} onPress={onNewComment}>
  <Feather name="send" size={24} color={theme.colors.primaryDark} />
  </TouchableOpacity>
  )}

  
</View>

     {/* Comment */}
     <View style={{marginVertical:15,gap:17}}>
        {
            post?.comments?.map(comment => 
                <CommentItem key={comment?.id?.toString()} item={comment} canDelete={user.id == comment.userId || user.id == post.userId} onDelete={onDeleteComment}/>
            )
        }

        {
             post?.comments?.length == 0 &&(
                <Text style={{color:theme.colors.text , marginLeft:5}}>
                    Be first to comment !
                </Text>
             )
        }
     </View>
      </ScrollView>
    </View>
  )
}

export default postDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingVertical: widthPercent(7),
      },
      inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
      },
      list: {
        paddingHorizontal: widthPercent(4),
      },
    sendIcon: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.8,
        borderColor: theme.colors.primary,
        borderRadius: theme.radius.lg,
        borderCurve: 'continuous',
        height: heightPercent(5.8),
        width: heightPercent(5.8),
      },
      center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
      notFound: {
        fontSize: heightPercent(2.5),
        color: theme.colors.text,
        fontWeight: theme.fonts.medium,
      },
      loading: {
        height: heightPercent(5.8),
        width: heightPercent(5.8),
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ scale: 1.3 }],
      },
})