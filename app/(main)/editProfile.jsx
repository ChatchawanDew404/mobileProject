import { StyleSheet, Text, View , ScrollView, Pressable, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import Header from '../../components/Header'
import { heightPercent, widthPercent } from '../../helpers/common'
import { theme } from '../../constants/theme'
import { useAuth } from '../../contexts/AuthContext'
import { getUserImageSrc, uploadFile } from '../../service/imageService'
import AntDesign from '@expo/vector-icons/AntDesign'
import { Image } from 'expo-image'
import Input from '../../components/Input'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import Button from '../../components/Button'
import { updateUserData } from '../../service/userService'
import { useRouter } from 'expo-router'
import * as ImagePicker from "expo-image-picker"

const EditProfile = () => {
  const { user: currentUser, setUserData } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [user, setUser] = useState({
    name: '',
    phoneNumber: '',
    image: null,
    bio: '',
    address: ''
  })

  useEffect(() => {
    if (currentUser) {
      setUser({
        name: currentUser.name || '',
        phoneNumber: currentUser.phoneNumber || '',
        image: currentUser.image || '',
        address: currentUser.address || '',
        bio: currentUser.bio || ''
      })
    }
  }, [])

   // function สำหรับเลือกรูปภาพ จากอุปกรณ์ของผู้ใช้งาน (libary -> expo image picker)
   const onPickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
  
    if (!result.canceled) {
      setUser({ ...user, image:result.assets[0]});
    }
  };
  
  const onSubmit = async () => {
    let userData = { ...user }
    let { name, phoneNumber, address, image, bio } = userData

    if (!name || !phoneNumber || !address || !bio) {
      Alert.alert('Profile', "Please fill all the fields")
      return
    }

    setLoading(true)
    const res = await updateUserData(currentUser?.id, userData)
    setLoading(false)

    if (typeof image === 'object') {
      let imageRes = await uploadFile('profiles', image?.uri, true)
      if (imageRes.success) userData.image = imageRes.data
      else userData.image = null
    }

    if (res.success) {
      setUserData({ ...currentUser, ...userData })
      router.back()
    }

    console.log("check", res)
  }

  const imageSource = user.image && typeof user.image === 'object'
    ? user.image.uri
    : getUserImageSrc(user.image)

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <ScrollView style={{ flex: 1 }}>
          <Header title="Edit Profile" />

          <View style={styles.form}>
            <View style={styles.avatarContainer}>
              <Image source={imageSource} style={styles.avatar} />
              <Pressable onPress={onPickImage} style={styles.cameraIcon}>
                <AntDesign name="camerao" size={24} color="black" />
              </Pressable>
            </View>

            <Text style={{ fontSize: heightPercent(1.5), color: theme.colors.text, marginBottom: 10 }}>
              Please fill your profile details
            </Text>

            <View style={{ gap: 15 }}>
              <Input
                icon={<MaterialIcons name="account-circle" size={24} color="black" />}
                placeholder='Enter your name'
                onChangeText={value => setUser({ ...user, name: value })}
                value={user.name}
              />

              <Input
                icon={<MaterialIcons name="local-phone" size={24} color="black" />}
                placeholder='Enter your phone number'
                onChangeText={value => setUser({ ...user, phoneNumber: value })}
                value={user.phoneNumber}
              />

              <Input
                icon={<MaterialIcons name="location-on" size={24} color="black" />}
                placeholder='Enter your address'
                onChangeText={value => setUser({ ...user, address: value })}
                value={user.address}
              />

              <Input
                placeholder='Enter your bio'
                onChangeText={value => setUser({ ...user, bio: value })}
                value={user.bio}
                multiline={true}
                containerStyle={styles.bio}
              />
            </View>

            <View style={{ marginTop: 20 }}>
              <Button title="Update" loading={loading} onPress={onSubmit} />
            </View>
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  )
}

export default EditProfile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: widthPercent(4),
  },
  avatarContainer: {
    height: heightPercent(14),
    width: heightPercent(14),
    alignSelf: 'center',
    position: 'relative',
    marginBottom: 30,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: theme.radius.xxl * 1.8,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: theme.colors.darkLight,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: -10,
    padding: 8,
    borderRadius: 50,
    backgroundColor: 'white',
    shadowColor: theme.colors.textLight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 7,
  },
  bio: {
    flexDirection: "row",
    height: heightPercent(15),
    alignItems: 'flex-start',
    paddingVertical: 15,
  }
})
