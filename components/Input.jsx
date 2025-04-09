import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { heightPercent } from '../helpers/common'
import { theme } from '../constants/theme'

const Input = (props) => {
  return (
    <View style={[styles.container , props.containerStyle && props.containerStyles]}>
      {
        props.icon && props.icon
      }
      <TextInput style={{flex:1}} 
      placeholder={theme.colors.text.textLight}
      ref={props.inputRef && props.inputRef}
      {...props}
      />
    </View>
  )
}

export default Input

const styles = StyleSheet.create({
    container:{
        flexDirection:'row',
        height:heightPercent(7.2),
        alignItems: 'center',
        justifyItems: 'center',
        borderWidth:0.4,
        borderColor:theme.colors.text,
        borderRadius:theme.radius.xxl,
        borderCurve:'continuous',
        gap:12,
        paddingHorizontal:18
    }
})