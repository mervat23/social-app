import { Avatar, Dropdown, Label, Typography } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Post from '../Post/Postt'
import CreateComment from './../CreateComment/CreateComment';
import CreatePost from '../CreatePost/CreatePost'

const Home = () => {

  const[posts,setPosts]=useState(null)

  function getAllPosts(){
  
    return axios.get("https://route-posts.routemisr.com/posts",{
      headers:{
       "Authorization" :"Bearer "+localStorage.getItem("token")
      }
  })
  
  }
  useEffect(function(){
    getAllPosts()
  },[])


  const {data,isError,isFetching,isLoading}=useQuery({
      queryKey:["Posts"],
      queryFn:getAllPosts,
      
     })

     if(isLoading){
      return  <div className='h-screen flex justify-center items-center'>
    <i className='fa-solid fa-spinner fa-spin fa-7x'></i>
      </div>
      }
  

  return (
    <>
   <div className='my-12'>

    <CreatePost/>
     <Typography type='h1' align='center'  className='text-blue-700 '>All Posts</Typography>
    
    
      {data?.data.data.posts.map(function(post,idx:number){
      return  <Post key={idx} post={post} isPostDetails={false}/>
      
      })}
    
      </div>

    </>
  )

}


export default Home
