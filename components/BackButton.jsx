import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { theme } from '../constants/theme'
import AntDesign from '@expo/vector-icons/AntDesign';

// ปุ่มย้อนกลับ
const BackButton = ({size=26, router}) => {
  return (
    <Pressable onPress={() => router.back()} style={styles.button}>
     <AntDesign name="left" size={24} color="black" />
    </Pressable>
  )
} 

export default BackButton

const styles = StyleSheet.create({
  button:{
    marginTop: 40,
    alignSelf:"flex-start",
    padding:"5",
    borderRadius:20,
    backgroundColor:"rgba(0,0,0,0.07)"
  }
})