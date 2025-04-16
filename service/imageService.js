import * as FileSystem from 'expo-file-system'
import { supabase } from '../lib/supabase'
import { decode } from 'base64-arraybuffer'
import { supabaseUrl } from '../constants'

export const getUserImageSrc = imagePath =>{
    if(imagePath){
        return getSupabaseFileUrl(imagePath);
    }
    else{
        return require('../assets/images/defaultUserImg.png')
    }
}

export const getSupabaseFileUrl = filePath =>{
    if(filePath){
        return {uri: `${supabaseUrl}/storage/v1/object/public/uploads/${filePath}`}
    }
    return null;
}



export const downloadFile = async (url) => {
  try {
    const { uri } = await FileSystem.downloadAsync(url, getLocalFilePath(url));
    return uri;
  } catch (error) {
    console.error("Error downloading file:", error);
    return null;
  }
};


export const getLocalFilePath = (filePath) => {
  const fileName = filePath.split('/').pop();
  return `${FileSystem.documentDirectory}${fileName}`;
};



export const uploadFile = async (folderName, fileUri, isImage = true) => {
    try {
      const fileName = getFilePath(folderName, isImage);
      const fileBase64 = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 });
      const fileBuffer = decode(fileBase64);
  
      const { data, error: storageError } = await supabase.storage
        .from('uploads')
        .upload(fileName, fileBuffer, {
          cacheControl: '3600',
          upsert: false,
          contentType: isImage ? 'image/*' : 'video/*',
        });
  
      if (storageError) {
        console.log('Supabase storage error: ', storageError);
        return { success: false, msg: 'Could not upload media' };
      }
  
      return { success: true, data: data?.path }; // Return the path of the uploaded file
    } catch (error) {
      console.log('File upload error: ', error);
      return { success: false, msg: 'Could not upload media' };
    }
  };
  

  export const getFilePath = (folderName, isImage = false) => {
    const timestamp = new Date().getTime();
    const extension = isImage ? '.png' : '.mp4';
    return `${folderName}/${timestamp}${extension}`;
  };