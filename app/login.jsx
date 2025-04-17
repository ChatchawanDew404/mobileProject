import { StyleSheet, Text, View , TextInput, Pressable , Alert} from 'react-native'
import React , { useRef , useState } from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import { theme } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import BackButton from '../components/BackButton';
import { useRouter } from 'expo-router';
import { heightPercent, widthPercent } from '../helpers/common'
import Input from '../components/Input';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Button from '../components/Button'
import { supabase } from '../lib/supabase';


const Login = () => {
    const router = useRouter()
    const emailRef = useRef("")
    const passwordRef = useRef("")
    const [loading , setLoading] = useState(false)

  async function onSubmit(){
       if(!emailRef.current || !passwordRef.current ){
        Alert.alert('Login' , "please fill all the fields !");
           return;
       }
       let email = emailRef.current.trim();
       let password = passwordRef.current.trim();
       setLoading(true);
       const {error} = await supabase.auth.signInWithPassword({
        email,password
       })

       if(error){
        Alert.alert('login' , error.message)
       }
       setLoading(false);
   }

  return (
    <ScreenWrapper>
        <StatusBar style="dark"/>
      <View style={styles.container}>
        <BackButton router={router}/>

    <View>
        <Text style={styles.welcomeText}>Hey,</Text>
        <Text style={styles.welcomeText}>Welcome Back</Text>
      </View>

      <View style={styles.form}>
        <Text style={{fontSize:heightPercent(1.5) , color:theme.colors.text}}>
            Please login to continue
        </Text>
        <Input icon={<MaterialIcons name="email" size={24} color="black" />} placeholder='Enter your email' onChangeText={value=> emailRef.current = value}/>
        <Input icon={<MaterialIcons name="password" size={24} color="black" />} placeholder='Enter your password' onChangeText={value=> passwordRef.current = value}/>

        <Text style={styles.forgotPassword}>Forgot Password ?</Text>
        <Button title={'login'} loading={loading} onPress={onSubmit}></Button>

        <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account ?</Text>
            <Pressable onPress={()=>{router.push('signup')}}>
                <Text style={[styles.footerText,{color:theme.colors.primaryDark , fontWeight:theme.fonts.semibold}]}>Sign up</Text>
            </Pressable>
        </View>
      </View>
      </View>
    
    </ScreenWrapper>
  )
}

export default Login

const styles = StyleSheet.create({
    container:{
        flex:1,
        gap:45,
        paddingHorizontal:widthPercent(5)
    },
    welcomeText:{
        fontSize:heightPercent(4),
        fontWeight:theme.fonts.bold,
        color:theme.colors.text
    },
    form:{
        gap:25
    },
    forgotPassword:{
        textAlign:'right',
        fontWeight:theme.fonts.semibold,
        color:theme.colors.text
    },
    footerText:{
        textAlign:'center',
        color:theme.colors.text,
        fontSize:heightPercent(1.6)
    },
    footer:{
        flexDirection:"row",
        justifyContent: "center",
        alignItems:'center',
        gap:5
    }
})