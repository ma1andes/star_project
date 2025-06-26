import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function RegisterPage() {
    const [role, setRole] = useState('')
    const [username, setUsername] = useState()
    const [email, setEmail] = useState()
    const [name, setName] = useState()
    const [password, setPassword] = useState()
    const [password2, setPassword2] = useState()
    const navigate = useNavigate()

    const onSubmitHadnler = async(e) =>{
        e.preventDefault()
        if (password != password2){
            alert('pizdec')
            return
        }
        const response = await fetch('http://10.16.0.83:8000/api/register', {
            method: "POST",
            headers: {"content-type": "application/json"},
            body: JSON.stringify({email, password, name, username, role})
        })
        if (response.status === 201){
            navigate('/login')
        }
    }
   
  return (
    <div>
        <form onSubmit={onSubmitHadnler}>
            <select value={role} onChange={(el) => setRole(el.target.value)}>
                <option value="" disabled>выбери роль</option>
                <option value="admin">admin</option>
                <option value="qa">QA</option>
                <option value="user">user</option>
            </select>
            <input type="text"  placeholder='username' value={username} onChange={(el) => setUsername(el.target.value)}/>
            <input type="email"  placeholder='email' value={email} onChange={(el) => setEmail(el.target.value)}/>
            <input type="text"  placeholder='name' value={name} onChange={(el) => setName(el.target.value)}/>
            <input type="password"  placeholder='password' value={password} onChange={(el) => setPassword(el.target.value)}/>
            <input type="password"  placeholder='repeat password dalbayob' value={password2} onChange={(el) => setPassword2(el.target.value)}/>
            <button type="submit">register</button>
        </form>
    </div>
  )
}

export default RegisterPage