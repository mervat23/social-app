import React from 'react'
import CreatePost from '../CreatePost/CreatePost'
import { Typography } from '@heroui/react' 
import Post from '../Post/Postt'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'


const Profile = () => {

    const{user}:{user:string}=jwtDecode(localStorage.getItem("token"))

    function getUserPost(){
      return axios.get(`https://route-posts.routemisr.com/users/${user}/posts`,{
         headers:{
       "Authorization" :"Bearer "+localStorage.getItem("token")
      }
      })
    }

     const {data,isLoading}=useQuery({
          queryKey:["UserPost"],
          queryFn:getUserPost,
          
         })

    if(isLoading){
      return  <div className='h-screen flex justify-center items-center'>
    <i className='fa-solid fa-spinner fa-spin fa-7x'></i>
      </div>
      }
  
  return (
      <div className='my-12'>

    <CreatePost/>
     <Typography type='h1' align='center'  className='text-blue-700 '>All Posts</Typography>
    
    
      {data?.data.data.posts.map(function(post,idx:number){
      return  <Post key={idx} post={post} isPostDetails={false}/>
      
      })}
    
      </div>

  )
}

export default Profile
