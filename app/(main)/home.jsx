import { StyleSheet, Text, View , Pressable , FlatList } from 'react-native'
import { useIsFocused } from '@react-navigation/native';
import React , {useState , useEffect} from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import Button from '../../components/Button'
import {useAuth} from "../../contexts/AuthContext"
import { supabase } from '../../lib/supabase'
import { heightPercent, widthPercent } from '../../helpers/common'
import { theme } from '../../constants/theme'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Octicons from '@expo/vector-icons/Octicons';
import { useRouter } from 'expo-router'
import Avatar from '../../components/Avatar'
import { fetchPosts } from '../../service/postService'
import PostCard from '../../components/PostCard'
import Loading from '../../components/Loading'
import { getUserData } from '../../service/userService'
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

var limit = 0

const home = () => {
    const {setAuth,user} = useAuth();
    const router = useRouter()

    const [posts,setPosts] = useState([])
    const [hasMore,setHasMore] = useState(true)

    const handlePostEvent = async (payload) => {
      // หากมีการ insert เกิดขึ้น ให้ทำการนำข้อมูลชุดใหม่ เพิ่มเข้าในข้อมูลชุดเก่า พร้อมกับ update ข้อมูล
      if (payload.eventType === 'INSERT' && payload.new?.id) {
        let newPost = { ...payload.new };
        let res = await getUserData(newPost.userId);
        newPost.postLikes = [];
        newPost.comments = [{ count: 0 }];
        newPost.user = res.success ? res.data : {};
        setPosts((prevPosts) => [newPost, ...prevPosts]);
      }
  
      if (payload.eventType === 'DELETE' && payload.old?.id) {
        setPosts((prevPosts) => {
          let updatedPosts = prevPosts.filter((post) => post.id !== payload.old.id);
          return updatedPosts;
        });
      }

      if (payload.eventType === 'UPDATE' && payload.new?.id) {
        setPosts((prevPosts) => {
          let updatePosts = prevPosts.map((post) =>{
            if(post.id == payload.new.id){
                post.body = payload.new.body
                post.file = payload.new.file
            }
            return post
          })
          return updatePosts
        });
      }
    };


    useEffect(() =>{
      let postChannel = supabase
    .channel('posts')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'posts' },
      handlePostEvent
    )
    .subscribe();

  getPosts();

  return () => {
    supabase.removeChannel(postChannel);
  };
    },[])

    // reload when user change page
    useFocusEffect(
      useCallback(() => {
        getPosts();
      }, [])
    );


    // get all post 
    const getPosts = async() =>{
      if(!hasMore){
         return null ;
      }
      limit = limit + 10
        let res = await fetchPosts(limit);
        if(res.success){
          if(posts.length == res.data.length) {setHasMore(false)};
         setPosts(res.data)
}
    }


  return (
    <ScreenWrapper bg="white">
    <View style={styles.container}>

        <View style={styles.header}>
          <Text style={styles.title}>Kaiphum</Text>
          <View style={styles.icons}>
          <Pressable onPress={() =>{router.push('newPost')}}>
            <Octicons name="diff-added" size={28} color={theme.colors.text} />
            </Pressable>
            <Pressable onPress={() =>{router.push('profile')}}>
            <Avatar 
              uri={user?.image}
              size={heightPercent(4.3)}
              rounded = {theme.radius.sm}
              style={{borderWidth:2}}
            />
            </Pressable>
          </View>
        </View>

        <FlatList
  data={posts}
  showsVerticalScrollIndicator={false}
  contentContainerStyle={styles.listStyle}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => (
    <PostCard
      item={item}
      currentUser={user}
      router={router}
    />
  )}

  onEndReached={() =>{
     getPosts();
  }} // เมื่อเลื่อนหน้าจอจนสุด

  onEndReachedThreshold={0}

  ListFooterComponent={hasMore ?(
  <View style={{marginVertical:posts.length == 0 ? 200 : 30}}> 
  <Loading/>
  </View>) : <View style={{marginVertical:30}}><Text style={styles.noPosts}>No more posts</Text></View>}
/>
        </View>
     {/* <Button title="Logout" onPress={onLogout}/> */}
   
    </ScreenWrapper>
  )
}

export default home

const styles = StyleSheet.create({
   container:{
    flex:1,
   },
   header: {
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginHorizontal: widthPercent(4),
  },
  title: {
    color: theme.colors.text,
    fontSize: heightPercent(3.2),
    fontWeight: theme.fonts.bold,
  },
  avatarImage: {
    height: heightPercent(4.3),
    width: heightPercent(4.3),
    borderRadius: theme.radius.sm,
    borderCurve: 'continuous',
    borderColor: theme.colors.gray,
    borderWidth: 3,
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
   listStyle: {
    paddingTop: 20,
    paddingHorizontal: widthPercent(4),
  },
  noPosts: {
    fontSize: heightPercent(2),
    textAlign: 'center',
    color: theme.colors.text,
  },
  pill: {
    position: 'absolute',
    right: -10,
    top: -4,
    height: heightPercent(2.2),
    width: heightPercent(2.2),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: theme.colors.roselight,
  },
  pillText: {
    color: 'white',
    fontSize: heightPercent(1.2),
    fontWeight: theme.fonts.bold,
  },
})