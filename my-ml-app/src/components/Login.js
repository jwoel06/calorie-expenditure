import React from 'react'
import './Login.css'
const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState('');
  


  return (
    <main>
      <div className='welcome-container'>
        <h1 className='welcome-title'>Go Sally!</h1>
        <p className='welcome-content'>Find Out What You Are Capable Of</p>
      </div>
      <div className='login-container'>
        <h1 className='login-title'>Sign In</h1>
        <div id="login-items" className="login-items">
          <form>
            <label htmlFor='email'>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange = {e => setEmail(e.target.value)}
              placeholder="Enter Email" 
            />
            <label htmlFor='password'>Password</label>
            <input 
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password" 
            />
              <div className="remember-me">
                <input 
                type="checkbox" 
                value={rememberMe} 
                onChange = {e => setRememberMe(e.target.value)}
                />
                <label htmlFor='rememberMe'>Remember Me</label>
              </div>
            <button type="submit" onClick = {handleClick}>Login</button>
          </form>
        </div>
      </div>
    </main>
  )
}

export default Login