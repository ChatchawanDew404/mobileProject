import { View, Text ,StyleSheet , Image, Pressable} from 'react-native'
import React from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import { StatusBar } from 'expo-status-bar'
import { heightPercent, widthPercent } from '../helpers/common'
import {theme} from '../constants/theme'
import Button from '../components/Button'
import { useRouter } from 'expo-router'

const Welcome = () => {
  const router = useRouter()
  return (
    <ScreenWrapper bg="white">
        <StatusBar style="dark"/>
      <View style={styles.container}>
        <Image style={styles.welcomeImage} resizeMode='contain' source={require('../assets/images/KaipumLogo.png')}/>

        <View style={{gap:20}}/>
        <Text style={styles.title}>Welcome !</Text>
        <Text style={styles.punchline}>Where every thougth find a home and every image tells a story</Text>
      </View>

      <View>
        <Button title='Getting Started' buttonStyle={{marginHorizontal: widthPercent(8) , marginBottom: 35}} onPress={()=>{router.push('signup')}}/>
            <View style={styles.borderTextContainer}>
                 <Text style={styles.loginText}> Already have an account !</Text>
                 <Pressable onPress={() =>{router.push('login')}}>
                    <Text style={[styles.loginText , {color:theme.colors.primaryDark , fontWeight:theme.fonts.semibold}]}>Login</Text>
                 </Pressable>
            </View>
      </View>
    </ScreenWrapper>
  
  )
}

export default Welcome

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: 'white',
       paddingHorizontal:widthPercent(4),
    },
    welcomeImage:{
        height:heightPercent(30),
        width:widthPercent(100),
        alignSelf:'center',
        marginTop: 150
    }
    , title:{
      color:theme.colors.text,
      fontSize:heightPercent(4.5),
      fontWeight:theme.fonts.extraBold,
      textAlign:'center',
      marginBottom: -10
    }
    ,
    punchline:{
        textAlign:'center',
        paddingHorizontal:widthPercent(10),
        fontSize:heightPercent(1.7),
        color:theme.colors.text,
        marginBottom: 100
    },
    footer:{
        gap:30,
        width:'100%'
    },
    borderTextContainer:{
        flexDirection:'row',
        justifyContent:'center',
                alignItems:'center',
        gap:5,
        marginBottom:50
    },
    loginText:{
        textAlign:'center',
        color:theme.colors.text,
        fontSize:heightPercent(1.8)
    }
})