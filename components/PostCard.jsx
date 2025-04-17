import { Share, StyleSheet, Text, TouchableOpacity, View , Alert } from 'react-native';
import React, { useEffect , useState} from 'react';
import { theme } from '../constants/theme';
import { heightPercent, stripHtmlTags, widthPercent } from '../helpers/common';
import Avatar from './Avatar';
import moment from 'moment';
import AntDesign from '@expo/vector-icons/AntDesign';
import RenderHtml from 'react-native-render-html'
import { Image } from 'react-native';
import { downloadFile, getSupabaseFileUrl } from '../service/imageService';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Octicons from '@expo/vector-icons/Octicons';
import { Video } from 'expo-av';
import { createPostLike , removePostLike } from '../service/postService';

const textStyle = {
  color: theme.colors.dark,
  fontSize: heightPercent(1.75),
};

const tagsStyles = {
  div: textStyle,
  p: textStyle,
  ol: textStyle,
  h1: {
    color: theme.colors.dark,
  },
  h4: {
    color: theme.colors.dark,
  },
};
const PostCard = ({
  item,
  currentUser,
  router,
  hasShadow = true,
  showMoreIcon = true,
  showDelete=false,
  onEdit=()=>{},
  onDelete=()=>{},
}) => {
  const shadowStyles = {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  };

  const  [likes , setLikes] = useState([])

  useEffect(() =>{
    setLikes(item?.postLikes || [])
  },[])


  // เมื่อ user กด หัวใจ ให้ทำอะไร
  const onLike = async() =>{
    if(liked){
      // remove like
    let updatedLikes = likes.filter(like => like.userId !== currentUser?.id);
    setLikes([...updatedLikes]);
    let res = await removePostLike(item?.id, currentUser?.id);
    if (!res.success) {
      Alert.alert('Post', 'Something went wrong!');
    }
  }
    else{
      let data = {
        userId: currentUser?.id,
        postId: item?.id,
      };
      setLikes([...likes,data])
      let res = await createPostLike(data);
      if (!res.success) {
        Alert.alert('Post', 'Something went wrong!');
      }
    }
   
  }

  // เมื่อ user กด share ให้ทำอะไร
  const onShare = async() =>{
    let content = {message : stripHtmlTags(item?.body)}
    if(item?.file){
      let url = await downloadFile(getSupabaseFileUrl(item?.file).uri)
      console.log(url)
      content.url = url
    }
    Share.share(content)
  }

  // เมื่อ user กด comment ให้ทำอะไร
  const openPostDetails = () =>{
    if(!showMoreIcon) return null;
    router.push({pathname:'postDetails' , params:{postId: item?.id}})
  }

  // -- เมื่อ user กดลบ post
  const handlePostDelete = () =>{
        Alert.alert('Confirm' , " Are you sure you want to delete this post ?" ,[
                    {
                      text:'Cancel',
                      onPress:()=>console.log('modal cancelled'),
                      style:'cancel'
                    },
                    {
                      text:'Delete',
                      onPress:()=> onDelete(item),
                      style:'destructive'
                    }
                  ])
  }


  const createAt = moment(item?.created_at).format("MMM D")
  const liked = likes.filter(like => like.userId==currentUser?.id)[0] ? true: false || false;

  return (
    <View style={[styles.container , hasShadow && shadowStyles]}>
     <View style={styles.header}>
            
            <View style={styles.userInfo}>
                 <Avatar size={heightPercent(4.5)} uri={item?.user?.image} rounded={theme.radius.md}/>

                 <View style={{gap:2}}>
                  <Text style={styles.username}>{item?.user?.name}</Text>
                  <Text style={styles.postTime}>{createAt}</Text>
                 </View>
            </View>

            {showMoreIcon &&  (
       <TouchableOpacity onPress={openPostDetails}>
       <AntDesign name="ellipsis1" size={24} color="black" />
       </TouchableOpacity>
            )}


            {
              showDelete && currentUser.id == item?.userId && (
                <View style={styles.actions}>
                    <TouchableOpacity onPress={() =>onEdit(item)}>
                    <AntDesign name="edit" size={heightPercent(2.5)} color="black" />
       </TouchableOpacity>
                    <TouchableOpacity onPress={handlePostDelete}>
                    <AntDesign name="delete" size={heightPercent(2.5)} color="red" />
       </TouchableOpacity>
                </View>
              )
            }

     </View>

     <View style={styles.content}>
       <View style={styles.postBody}>
        {
          item?.body && (
            <RenderHtml contentWidth={widthPercent(100)} source={{html:item?.body}} tagsStyles={tagsStyles}/>
          )
        }
       </View>

      {
        item?.file && item?.file?.includes('postImages') && (
          <Image source={getSupabaseFileUrl(item?.file)} 
          transition={100} 
          style={styles.postMedia} 
          contentFit='cover'/>
        )
      }

      {
        item?.file && item?.file?.includes('postVideos') && (
          <Video style={[styles.postMedia , {height:heightPercent(30)}]} source={getSupabaseFileUrl(item?.file)} useNativeControls resizeMode='cover' isLooping/>
        )
      }

      <View style={styles.footer}>
        {/* likes */}
         <View style={styles.footerButton}>
          <TouchableOpacity onPress={onLike}>
          <Octicons name="heart" size={24} color={liked? theme.colors.rose : theme.colors.textLight}/>
          </TouchableOpacity>
          <Text style={styles.count}>
               {
                    likes?.length
               }
          </Text>
         </View>
         {/* comment */}
         <View style={styles.footerButton}>
          <TouchableOpacity onPress={openPostDetails}>
          <FontAwesome6 name="commenting" size={24} color={theme.colors.textLight} />
          </TouchableOpacity>
          <Text style={styles.count}>
               {
                    item?.comments[0]?.count
               }
          </Text>
         </View>

         {/* download */}
         <View style={styles.footerButton}>
          <TouchableOpacity onPress={onShare}>
          <AntDesign name="sharealt" size={24} color="black" />
          </TouchableOpacity>
         </View>
      </View>
     </View>
    </View>
  );
};

export default PostCard;

const styles = StyleSheet.create({
    container: {
        gap: 10,
        marginBottom: 15,
        borderRadius: theme.radius.xl * 1.1,
        borderCurve: 'continuous',
        padding: 10,
        paddingVertical: 12,
        backgroundColor: 'white',
        borderWidth: 0.5,
        borderColor: theme.colors.gray,
        shadowColor: '#000',
        // ... (shadow styles from before) ...
      },
      header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center', // Added alignment
      },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      },
      username: {
        fontSize: heightPercent(1.7),
        color: theme.colors.textDark,
        fontWeight: theme.fonts.medium,
      },
      postTime: {
        fontSize: heightPercent(1.4),
        color: theme.colors.textLight,
        fontWeight: theme.fonts.medium,
        gap: 4,
      },
      content: {
        gap: 10,
        marginBottom: 10,
      },
      postMedia: {
        height: heightPercent(40),
        width: '100%',
        borderRadius: theme.radius.xl,
        borderCurve: 'continuous',
      },
    postBody: {
        marginLeft: 5,
      },
      footer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
      },
      footerButton: {
        marginLeft: 5,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
      },
      actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 18,
      },
      count: {
        color: theme.colors.text,
        fontSize: heightPercent(1.8),
      },
});