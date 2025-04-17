import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View , Alert, Pressable, FlatList} from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'expo-router';
import Header from '../../components/Header';
import { heightPercent, widthPercent } from '../../helpers/common';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { theme } from '../../constants/theme';
import { supabase } from '../../lib/supabase';
import Avatar from '../../components/Avatar';
import Feather from '@expo/vector-icons/Feather';
import Fontisto from '@expo/vector-icons/Fontisto';
import { fetchPosts } from '../../service/postService';
import Loading from '../../components/Loading';
import PostCard from '../../components/PostCard';

var limit = 0;
const Profile = () => {
  const { user, setUser } = useAuth();
  const router = useRouter();

   const [posts,setPosts] = useState([])
   const [hasMore,setHasMore] = useState(true)

  const onLogout = async () =>{
    const {error} = await supabase.auth.signOut()
    if(error){
      Alert.alert('Sign out' , "Error signing out!")
    }
  }

  const handleLogout = async () =>{
    Alert.alert('Confirm' , " Are you sure you want to log out ?" ,[
      {
        text:'Cancel',
        onPress:()=>console.log('modal cancelled'),
        style:'cancel'
      },
      {
        text:'Logout',
        onPress:()=> onLogout(),
        style:'destructive'
      }
    ])
  }

   
  // เเสดงโพสตทั้งหมดของผู้ใช้คนนั้น
    const getPosts = async() =>{
        if(!hasMore){
           return null ;
        }
        limit = limit + 10
          let res = await fetchPosts(limit , user.id);
          if(res.success){
            if(posts.length == res.data.length) {setHasMore(false)};
           setPosts(res.data)
  }
      }
  
    
  return (
    <ScreenWrapper bg="white" >
      {/* show all data post from user */}
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

  ListHeaderComponent={ <UserHeader user={user} router={router} handleLogout={handleLogout}/>}
  ListHeaderComponentStyle={{marginBottom:80}}
  ListFooterComponent={hasMore ?(
  <View style={{marginVertical:posts.length == 0 ? 200 : 30}}> 
  <Loading/>
  </View>) : <View style={{marginVertical:30}}><Text style={styles.noPosts}>No more posts</Text></View>}
/>
    </ScreenWrapper>
  );
};

const UserHeader = ({ user, router ,handleLogout}) => {
  return (
    <View style={{flex:1 , backgroundColor:"white" , paddingHorizontal:widthPercent(4)}}>
      <View>
      <Header title="Profile" mb={30}/>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
      <MaterialIcons name="logout" size={24} color="red" />
      </TouchableOpacity>
      </View>

      <View style={styles.container}>
      <View style={{gap:15}}>
        <View style={styles.avatarContainer}>
        <Avatar uri={user?.image} size={heightPercent(12)} rounded={20}/>
        <Pressable style={styles.editIcon} onPress={()=>{router.push('editProfile')}}>
        <Feather name="edit-3" size={24} color="black" />
        </Pressable>
        </View>

        {/* user name and address */}
        <View style={{alignItem:'center' , gap:4}}>
          <Text styles={styles.userName}>{user && user.name}</Text>
          <Text styles={styles.infoText}>{user && user.address}</Text>
        </View>

        <View style={{gap:10}}>
              <View style={styles.info}>
              <Fontisto name="email" size={24} color="black" />
                <Text style={styles.infoText}>{user && user.email}</Text>
              </View>
              {
                user && user.phoneNumber && (
                  <View style={styles.info}>
                  <Feather name="phone" size={24} color="black" />
                    <Text style={styles.infoText}>{user && user.phoneNumber}</Text>
                  </View>
                )
              }

              {
                 user && user.bio && (
                  <Text style={styles.infoText}>{user.bio}</Text>
                 )
              }
           
        </View>

      </View>
      </View>
    </View>
  );
};

// จบที่ 38:30


export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    marginHorizontal: widthPercent(4),
    marginBottom: 20,
    alignItems: 'center',
  },
  headerShape: {
    width: widthPercent(100),
    height: heightPercent(20),
  },
  avatarContainer: {
    height: heightPercent(12),
    width: heightPercent(12),
    alignSelf: 'center',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: -12,
    padding: 7,
    borderRadius: 50,
    backgroundColor: 'white',
    shadowColor: theme.colors.textLight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 7,
  },
  userName: {
    fontSize: heightPercent(3),
    fontWeight: '500',
    color: theme.colors.textDark,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoText: {
    fontSize: heightPercent(1.6),
    fontWeight: '500',
    color: theme.colors.textLight,
  },
  logoutButton: {
    position: 'absolute',
    right: 15,
    top:2, 
    padding: 7,
    backgroundColor: '#fee2e2',
    borderRadius:30
  },
  listStyle: {
    paddingHorizontal: widthPercent(4),
    paddingBottom: 30,
  },
  noPosts: {
    fontSize: heightPercent(2),
    textAlign: 'center',
    color: theme.colors.text,
  },
});