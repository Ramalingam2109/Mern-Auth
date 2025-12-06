import { useState, createContext, useEffect, useCallback } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

// Configure axios defaults
axios.defaults.withCredentials = true

export const AppContext = createContext()

export const AppContextProvider = ({ children }) => {
  // Ensure backend URL ends with a slash
  const backendUrl = import.meta.env.VITE_BACKEND_URL
    ? import.meta.env.VITE_BACKEND_URL.endsWith('/')
      ? import.meta.env.VITE_BACKEND_URL
      : import.meta.env.VITE_BACKEND_URL + '/'
    : 'http://localhost:3000/' // Fallback URL

  const [state, setState] = useState({
    isLoggedIn: false,
    userData: null,
    isLoading: false,
    isVerified: false,
  })

  // Combined state updater
  const updateState = updates => {
    setState(prev => ({ ...prev, ...updates }))
  }

  const getUserData = useCallback(async () => {
    try {
      updateState({ isLoading: true })
      const { data } = await axios.get(`${backendUrl}api/user/data`)

      if (data.success) {
        updateState({
          userData: data.user,
          isLoggedIn: true,
          isVerified: data.user?.isAccountVerified || false,
        })
        return true
      }
    } catch (error) {
      handleAuthError(error)
      return false
    } finally {
      updateState({ isLoading: false })
    }
  }, [backendUrl])

  // Handle authentication errors consistently
  const handleAuthError = error => {
    updateState({
      userData: null,
      isLoggedIn: false,
      isVerified: false,
    })

    // Check for specific DB connection errors
    if (error.response?.status === 500 || error.message.includes('Network Error')) {
      toast.error('Service Unavailable: Contact Administrator to reactivate database cluster')
    } else {
      const errorMsg = error.response?.data?.message || error.message || 'Authentication error'
      toast.error(errorMsg)
    }
  }

  // Check auth state on mount
  const getAuthState = useCallback(async () => {
    try {
      const { data } = await axios.get(`${backendUrl}api/auth/is-auth`)
      if (data.success) {
        await getUserData()
      }
    } catch (error) {
      handleAuthError(error)
    }
  }, [backendUrl, getUserData])

  useEffect(() => {
    getAuthState()
  }, [getAuthState])

  // Register function
  const register = async userData => {
    updateState({ isLoading: true })
    try {
      const { data } = await axios.post(`${backendUrl}api/auth/register`, userData)

      if (data.success) {
        updateState({
          userData: data.user,
          isLoggedIn: true,
          isVerified: data.user?.isAccountVerified || false,
        })
        toast.success('Registration successful!')
        return { success: true, user: data.user }
      }
    } catch (error) {
      handleAuthError(error)
      return { success: false, error: error.response?.data?.message || 'Registration failed' }
    } finally {
      updateState({ isLoading: false })
    }
  }

  // Login function
  const login = async credentials => {
    updateState({ isLoading: true })
    try {
      const { data } = await axios.post(`${backendUrl}api/auth/login`, credentials)

      if (data.success) {
        updateState({
          userData: data.user,
          isLoggedIn: true,
          isVerified: data.user?.isAccountVerified || false,
        })
        toast.success('Login successful!')
        return { success: true, user: data.user }
      }
    } catch (error) {
      handleAuthError(error)
      return { success: false, error: error.response?.data?.message || 'Login failed' }
    } finally {
      updateState({ isLoading: false })
    }
  }

  // Logout function
  const logout = async () => {
    try {
      updateState({ isLoading: true })
      await axios.post(`${backendUrl}api/auth/logout`)
      updateState({
        userData: null,
        isLoggedIn: false,
        isVerified: false,
      })
      toast.success('Logged out successfully')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Logout failed')
    } finally {
      updateState({ isLoading: false })
    }
  }

  // Value provided to consumers
  const value = {
    backendUrl,
    userData: state.userData,
    isLoggedIn: state.isLoggedIn,
    isLoading: state.isLoading,
    isVerified: state.isVerified,
    getUserData,
    register,
    login,
    logout,
    updateUserData: userData => updateState({ userData }),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
