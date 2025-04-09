import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { Stack, useRouter } from 'expo-router'
import { AuthProvider , useAuth} from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { getUserData } from '../service/userService'

const _layout = () =>{
  return (
    <AuthProvider>
       <MainLayout/>
    </AuthProvider> 
  )
}

const MainLayout = () => {
  const {setAuth , setUserData} = useAuth();
  const router = useRouter();

  useEffect(() =>{
      supabase.auth.onAuthStateChange((_event , session) =>{

        if(session){
          // move to home page
           setAuth(session?.user)
           updateUserData(session?.user)
           router.replace('/home')
        }else{
          // move to welcoome page
          setAuth(null);
          router.replace('/welcome')
        }
      })
  }, [])

  const updateUserData = async(user) =>{
   let res = await getUserData(user?.id);
   if(res.success){
    setUserData(res.data)
    console.log('get user data' , res)
   }
   
  }

  return (
    <Stack
    screenOptions={{
        headerShown:false
    }}/>
  )
}

export default _layout