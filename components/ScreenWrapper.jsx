import { View, Text } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const ScreenWrapper = ({children , bg}) => {
    const top = useSafeAreaInsets()
    const paddingTop = top > 0 ? top + 5 : 30;
  return (
    // กำหนดตตวามห่างระหว่างกล่อง กับ ของ mobile
    <View style={{flex:1 , paddingTop,backgroundColor:bg}}>
      {
        children
      }
    </View>
  )
}

export default ScreenWrapper