import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { heightPercent } from '../helpers/common'
import {Image} from 'expo-image'
import { getUserImageSrc } from '../service/imageService'
import { theme } from '../constants/theme'

const Avatar = ({ uri, size = heightPercent(4.5), rounded = theme.radius.md, style }) => {
    return (
      <Image
        source={getUserImageSrc(uri)}
        transition={100}
        style={[styles.avatar, { height: size, width: size, borderRadius: rounded }, style]}
      />
    );
  };

  
  
  export default Avatar;
  
  const styles = StyleSheet.create({
    avatar: {
      borderCurve: 'continuous',
      borderColor: theme.colors.darkLight,
      borderWidth: 1,
    },
  });