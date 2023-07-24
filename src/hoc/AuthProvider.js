import React, { useEffect } from 'react'
import { getAuthToken } from '../services/request/request-service'

const AuthProvider = ({children}) => {
  const pathName = window.location.pathname
  const {accessToken} = getAuthToken()

  useEffect(()=>{
    if(pathName!=='/login'&& !accessToken){
      window.location.replace('./login')
    }
  },[])
  return children
}

export default AuthProvider