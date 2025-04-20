import { Alert, StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { theme } from '../constants/theme'
import { heightPercent } from '../helpers/common'
import Avatar from './Avatar'
import moment from 'moment'
import AntDesign from '@expo/vector-icons/AntDesign';

const CommentItem = ({item , canDelete=false , onDelete=()=>{}}) => {
    const createAt = moment(item?.created_at).format('MMM D')
    console.log(createAt)

    const handleDelete = () =>{
         Alert.alert('Confirm' , " Are you sure you want to delete this comment ?" ,[
             {
               text:'Cancel',
               onPress:()=>console.log('modal cancelled'),
               style:'cancel'
             },
             {
               text:'Delete',
               onPress:()=> onDelete(item),
               style:'destructive'
             }
           ])


    }
  return (
    <View style={styles.container}>
      <Avatar uri={item?.user?.image}/>
      <View style={styles.content}>
        <View style={{flexDirection:'row', justifyContent:'space-between' , alignItems:'center'}}>
            <View style={styles.container}>
                <Text style={styles.text}>
                    {item?.user?.name}
                </Text>
                <Text>.</Text>
                <Text style={[styles.text , {color:theme.colors.textLight}]}>
                    {createAt}
                </Text>
            </View>
            {
                canDelete && (
                    <TouchableOpacity onPress={handleDelete}>
                    <AntDesign name="delete" size={24} color={theme.colors.rose} />
                    </TouchableOpacity>
                )
            }
        </View>
        <Text style={[styles.text , {fontWeight:'normal'}]}>{item?.text}</Text>
      </View>
    </View>
  )
}

export default CommentItem

const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'row',
        gap:7
    },
    content: {
        backgroundColor: 'rgba(0,0,0,0.06)',
        flex: 1,
        gap: 3,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 22,
        borderCurve: 'continuous',
      },
      highlight: {
        borderWidth: 0.2,
        backgroundColor: 'white',
        borderColor: theme.colors.dark,
        shadowColor: theme.colors.dark,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
      },
      nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
      },
      text: {
        fontSize: heightPercent(1.6),
        fontWeight: theme.fonts.medium,
        color: theme.colors.textDark,
      },
})