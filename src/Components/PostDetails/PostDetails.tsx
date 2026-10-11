import { Typography } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import React from 'react'
import Post from '../Post/Postt'
import { useParams } from 'react-router-dom'
import CreateComment from '../CreateComment/CreateComment'

const PostDetails = () => {

    const {id}=useParams()

    function getSinglePost(){
    return axios.get(`https://route-posts.routemisr.com/posts/${id}`,{
        headers:{
        Authorization:"Bearer "+localStorage.getItem("token")   
        }
    })
    }

  const{data,isLoading}=useQuery({
    queryKey:["Post",id],
    queryFn:getSinglePost
    })
    if(isLoading){
      return  <div className='h-screen flex justify-center items-center'>
    <i className='fa-solid fa-spinner fa-spin fa-7x'></i>
      </div>
      }
     
  return (
    <div className='my-12'>
        <Typography type='h1' align='center'  className='text-blue-700 '>Post Details</Typography>
       
        
         <Post post={data?.data.data.post} isPostDetails={true}/>
         </div>
      
  )
}

export default PostDetails
