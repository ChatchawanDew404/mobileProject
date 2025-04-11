import { supabase } from "../lib/supabase"



// รับ user ID เข้ามา เเล้วก็ให้ไปค้นหาข้อมูลในฐานข้อมูล เเล้วก็ส่งออกไปให้ไฟล์ที่ต้องการดึงข้อมูล
export const getUserData = async (userId) =>{
    try{
     const {data , error} = await supabase
     .from('users')
     .select()
     .eq('id',userId)
     .single();
     if(error){
        return {success:false , mag:error.message}
     }
     return {success:true , data}
    }
    catch(error){
        console.log('get error')
        return {success:false , mag:error.message}
    }
}

export const updateUserData = async (userId , data) =>{
    try{
     const {error} = await supabase
     .from('users')
     .update(data)
     .eq('id', userId)

     if(error){
        return {success:false , mag:error.message}
     }
     return {success:true , data}
    }
    catch(error){
        console.log('get error')
        return {success:false , mag:error.message}
    }
}