import { ScrollView, StyleSheet, Text, TouchableOpacity, View , Image, Pressable , Alert } from 'react-native'
import React, { useEffect, useRef , useState} from 'react'
import Header from '../../components/Header'
import ScreenWrapper from '../../components/ScreenWrapper'
import { widthPercent , heightPercent } from '../../helpers/common'
import { theme } from '../../constants/theme'
import Avatar from '../../components/Avatar'
import {useAuth} from "../../contexts/AuthContext"
import RichTextEditor from '../../components/RichTextEditor'
import { useLocalSearchParams, useRouter } from 'expo-router'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import Button from '../../components/Button'
import * as ImagePicker from "expo-image-picker"
import { getSupabaseFileUrl } from '../../service/imageService'
import { Video } from 'expo-av';
import { createOrUpdatePost } from '../../service/postService'

const newPost = () => {
  const {user} = useAuth()
  const bodyRef = useRef("")
  const editorRef = useRef(null)
  const router = useRouter();
  const [loading,setLoading] = useState(false);
  const [file,setFile] = useState(file)
  // ---- user click edit post
  const post = useLocalSearchParams() || {}
  
  
  useEffect(() =>{
    console.log(post)
    if(post && post.id){
      bodyRef.current = post.body
      setFile(post.file || null);
      setTimeout(() =>{
        editorRef?.current?.setContentHTML(post.body)
      },300)
    }
  },[])



  const onPick = async(isImage) =>{
    
    let mediaConfig = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      }

    if(!isImage){
      mediaConfig = {  
       mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing : true}
    }
      let result = await ImagePicker.launchImageLibraryAsync(mediaConfig)

      if(!result.canceled){
        setFile(result.assets[0])
      }
  }

  const isLocalFile = (file) =>{
    if(!file) return null 
    if(typeof file == 'object') return true 
  }

  const getFileType = (file) =>{
    if(!file) return null 
    if(isLocalFile(file)){
      return file.type
    }

    // ตรวจสอบ ไฟล์รูปภาพ หรือ วิดิโอ
    if(file.includes('postImage')){
      return 'image'
    }
    return 'video;'
  }

  const getFileUri = (file) =>{
    if(!file) return null 
    if(isLocalFile(file)){
      return file.uri
    }
    return getSupabaseFileUrl(file)?.uri;
  }

  const onSubmit = async() =>{
   if(bodyRef.current == '' && file == undefined){
    Alert.alert('Post' , "Please choose an image or add post body")
   }else{
    let data = {
      file,
      body:bodyRef.current,
      userId: user?.id
     }
     
     // หากมีการเเก้ไข (edit) ให้ทำอะไร
     if(post && post.id){data.id = post.id}


     // สร้าง post
     setLoading(true)
     let res = await createOrUpdatePost(data);
     setLoading(false)
     if(res.success){
         setFile(null)
         bodyRef.current = ''
         let alertText = post && post.id ? "edit" : "create"
         Alert.alert('Post' , `Your post has been ${alertText} successfully.`)
         router.back()
         console.log("finish")
     }else{
      Alert.alert('Post' , res.msg)
     }
   }
  }


  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
      <Header title={post && post.id ? "Edit Post" : "Create Post"}/>
      <ScrollView contentContainerStyle={{gap:20}}>
      <View style={styles.header}>
          <Avatar uri={user?.image} size={heightPercent(6.5)} rounded={theme.radius.xl}/>
          <View style={{gap:2}}>
            <Text style={styles.username}>{user && user.name}</Text>
            <Text style={styles.public}>Public</Text>
          </View>
          </View>
          <View style={styles.textEditor}>
                 <RichTextEditor editorRef={editorRef} onChange={body =>bodyRef.current = body}/>
          </View>

          {file && (
            <View style={styles.file}>
              {
                getFileType(file) == 'video' ? (
                        <>
                        <Video style={{ width: '100%',
    height: heightPercent(25),
    borderRadius: 12,}} source={{uri:getFileUri(file)}} useNativeControls resizeMode='cover' isLooping/>
                        </>
                ) : (
                         <Image source={{uri:getFileUri(file)}} resizeMode='cover' style={{ width: '100%',
                          height: heightPercent(25),
                          borderRadius: 12,
                          backgroundColor: '#eee', }}/>
                ) 
              }

               <Pressable style={styles.closeIcon} onPress={() =>{ setFile(null)}}>
                 <AntDesign name="delete" size={24} color="white" />
               </Pressable>
            </View>
          )}

          <View style={styles.media}>
            <Text style={styles.addImageText}>Add to your post</Text>
              <View style={styles.mediaIcons}>
                <TouchableOpacity onPress={() =>{onPick(true)}}>
                <FontAwesome name="image" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() =>{onPick(false)}}>
                <FontAwesome name="video-camera" size={24} color="black" />
                </TouchableOpacity>
              </View>
          </View>

          <Button buttonStyle={{height:heightPercent(6.2)}} title={post && post.id ? "Update": "Post"} loading={loading} hasShadow={false} onPress={onSubmit}/>
      
      </ScrollView>
      </View>
    </ScreenWrapper>
  )
}

export default newPost

const styles = StyleSheet.create({
  container:{
    flex:1,
    marginBottom:30,paddingHorizontal:widthPercent(4),
    gap:15
  },
  title: {
    fontSize: heightPercent(2.5),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  username: {
    fontSize: heightPercent(2.2),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
  },
  avatar: {
    height: heightPercent(6.5),
    width: heightPercent(6.5),
    borderRadius: theme.radius.xl,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  publicText: {
    fontSize: heightPercent(1.7),
    fontWeight: theme.fonts.medium,
    color: theme.colors.textLight,
  },
  publicText: {
    fontSize: heightPercent(1.7),
    fontWeight: theme.fonts.medium,
    color: theme.colors.textLight,
  },
  textEditor: {
    // marginTop: 10,
  },
  media: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1.5,
    padding: 12,
    paddingHorizontal: 18,
    borderRadius: theme.radius.xl,
    borderCurve: 'continuous',
    borderColor: theme.colors.gray,
  },
  mediaIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  closeIcon:{
    position:'absolute',
    top:10,
    right:10,
    backgroundColor:'rgba(255,0,0,0.8)',
    padding:7,
    borderRadius:50,
   color:'white'
  }
})