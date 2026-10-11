import { Button, toast } from '@heroui/react'
import React from 'react'
import axios from "axios"
import { useMutation, useQueryClient } from '@tanstack/react-query'

const DeletePost = ({id}:{id:string}) => {

    const queryClient = useQueryClient()
    
    function deletePost(){
        return axios.delete(`https://route-posts.routemisr.com/posts/${id}`,{
             headers:{
           Authorization:"Bearer "+localStorage.getItem("token")
      
        } 
        })
    }

    const{isPending,mutate}=useMutation({
       mutationFn:deletePost,
        onSuccess:(data)=>{
               toast.success(data.data.message)
                queryClient.invalidateQueries({
                 queryKey:["Posts"],
               })
               
               queryClient.invalidateQueries({
                queryKey:["UserPost"],
               })
               },
               onError:(error)=>{
               toast.error(error.response.data.message)
               }
    })
  return (
    <div>
      <Button variant='danger' onClick={mutate}>
        Delete
      </Button>
    </div>
  )
}

export default DeletePost
