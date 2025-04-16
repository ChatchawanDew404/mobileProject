import { View, Text , LogBox} from 'react-native'
import React, { useEffect } from 'react'
import { Stack, useRouter } from 'expo-router'
import { AuthProvider , useAuth} from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { getUserData } from '../service/userService'

LogBox.ignoreLogs([
  'Warning: TRenderEngineProvider: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.',
  'Warning: MemoizedTNodeRenderer: Support for defaultProps will be removed from memo components in a future major release. Use JavaScript default parameters instead.',
  'Warning: TNodeChildrenRenderer: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.',
]);

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
           updateUserData(session?.user,session?.user.email)
           router.replace('/home')
        }else{
          // move to welcoome page
          setAuth(null);
          router.replace('/welcome')
        }
      })
  }, [])

  const updateUserData = async(user,email) =>{
   let res = await getUserData(user?.id);
   if(res.success){
    setUserData({...res.data , email})
   }
   
  }

  return (
    <Stack
    screenOptions={{
        headerShown:false
    }}>

        <Stack.Screen name="(main)/postDetails" options={{presentation : 'modal'}}/>
      </Stack>
    
  )
}

export default _layout