import React, { useEffect } from 'react'
import { getAuthToken } from '../services/request/request-service'

const AuthProvider = ({children}) => {
  const pathName = window.location.pathname
  const {accessToken} = getAuthToken()

  useEffect(()=>{
    // eslint-disable-next-line no-debugger
    debugger
    if(pathName!=='/login'&& !accessToken){
      window.location.replace('./login')
    }
  },[])
  return children
}

export default AuthProvider