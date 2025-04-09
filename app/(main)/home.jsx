import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import Button from '../../components/Button'
import {useAuth} from "../../contexts/AuthContext"
import { supabase } from '../../lib/supabase'

const home = () => {
    const {setAuth} = useAuth();
    const onLogout = async () =>{
        setAuth(null)
        const {error} = await supabase.auth.signOut()
        if(error){
            Alert.alert('Logout' , "error signing out")
        }
    }
  return (
    <ScreenWrapper>
    <View>
      <Text>home</Text>
     <Button title="Logout" onPress={onLogout}/>
    </View>
    </ScreenWrapper>
  )
}

export default home

const styles = StyleSheet.create({})