import { StyleSheet, Text, View , Pressable } from 'react-native'
import React from 'react'
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


const home = () => {
    const {setAuth,user} = useAuth();
    const router = useRouter()
    const onLogout = async () =>{
        setAuth(null)
        const {error} = await supabase.auth.signOut()
        if(error){
            Alert.alert('Logout' , "error signing out")
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
        </View>
     <Button title="Logout" onPress={onLogout}/>
   
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