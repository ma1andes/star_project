import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function LoginPage() {
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const navigate = useNavigate()

    const onSubmitHadnler = async(e) =>{
        e.preventDefault()
        const response = await fetch('http://10.16.0.83:8000/api/login', {
            method: "POST",
            headers: {"content-type": "application/json"},
            body: JSON.stringify({email, password})
        })
        const data = await response.json()
        if (response.status === 200){
            localStorage.setItem('auth_token', data.data.auth_token)
            localStorage.setItem('isAdmin', data.data.isAdmin)
            localStorage.setItem('role', data.data.role)
            navigate('/product')
        }
    }

  return (
    <div>
        <form onSubmit={onSubmitHadnler}>
            <input type="email"  placeholder='email' value={email} onChange={(el) => setEmail(el.target.value)}/>
            <input type="password"  placeholder='password' value={password} onChange={(el) => setPassword(el.target.value)}/>
            <button type="submit">login</button>
        </form>
    </div>
  )
}

export default LoginPage