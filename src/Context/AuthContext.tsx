import React, { createContext, useEffect, useState, type ReactNode } from 'react'

export const authContext=createContext()

const AuthContextProvider = ({children}:{children:ReactNode}) => {
  const[token,setToken]=useState(null)

  function insertUserToken(tkn){
    setToken(tkn)
  }

  function logoutContext(){
    localStorage.removeItem("token")
    setToken(null)
  }

  useEffect(function(){
   if(localStorage.getItem("token")!=null){
    setToken(localStorage.getItem("token"))
   }
  },[])
  return (
  <authContext.Provider value={

    {insertUserToken,token,
     logoutContext
    }
  }>

   {children}
  </authContext.Provider>
  )
}

export default AuthContextProvider
