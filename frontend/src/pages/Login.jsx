import React , {useState} from 'react'
import '../styles/login.css'
import {FaUser , FaLock} from "react-icons/fa"
import {useNavigate} from 'react-router-dom'

const LoginForm = ()=>{
  const [email , setEmail] = useState('')
  const [password , setPassword] = useState('')
  const [error,setError] = useState('')

  const navigate = useNavigate()
  const handleLogin = async (e) =>{
    e.preventDefault()

    try{
      const response = await fetch(
        'http://localhost:5678/api/auth/student/login',
        {
          method: 'POST',
          headers:{
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            email,
            password
          })
        }
      )
      const data = await response.json()
      if(response.ok){
        localStorage.setItem('token',data.token)
        console.log('Login successful')
        navigate('/dashboard')
      }else{
        setError(data.message || data)
      }
    }
    catch(error){
      console.log(error)
    }
  }
  return (
    <div className = 'wrapper'>
      <form onSubmit={handleLogin}>
        <h1>Login</h1>
        <div className="input-box">
          <input type="email" placeholder='email' required value={email} onChange={(e)=>setEmail(e.target.value)} />
          <FaUser className='icon' />
          
        </div>
         <div className="input-box">
          <input type="password" placeholder='password' required  value={password} onChange={(e)=>setPassword(e.target.value)}/>
          <FaLock  className='icon' />
        </div>

        {error &&(
          <p className="error-message">
            {error}
          </p>
        )}

        <div className="remember-forgot">
          <label><input type = "checkbox"/>Remember me</label>
          <a href="#">Forgot password?</a>
        </div>

        <button type="submit">Login</button>
        <div className="register-link">
          <p>Don't have an account? <a href="#">Register</a></p>
        </div>
      </form>
    </div>
  )
}
export default LoginForm














































































