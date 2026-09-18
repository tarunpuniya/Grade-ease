import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    try {

      const response = await fetch(
        'http://localhost:5678/api/auth/student/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email,
            password
          })
        }
      )

      const data = await response.json()

      if (response.ok) {

        localStorage.setItem('token', data.token)

        console.log('Login successful')

        navigate('/dashboard')

      } else {

        console.log(data)

      }

    } catch (error) {

      console.log(error)

    }
  }

  return (
    <div>

      <h1>Student Login</h1>

      <form onSubmit={handleLogin}>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">
          Login
        </button>

      </form>

    </div>
  )
}
export default Login