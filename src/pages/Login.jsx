import React, { useState } from 'react';
import Cookies from 'js-cookie';

function Login() {
  const [drugMachineCode, setDrugMachineCode] = useState('');

  const [password, setPassword] = useState('');

  const handleDrugMachineCodeChange = (e) => {
    setDrugMachineCode(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = () => {
    const backendURL = process.env.IS_PROD
      ? process.env.REACT_APP_BACKEND_URL_PROD
      : process.env.REACT_APP_BACKEND_URL;

    fetch(`${backendURL}/auth/loginDrugMachine`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        drugMachineCode: drugMachineCode,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        Cookies.set('session',JSON.stringify(data.result.drugMachine));

        const sessionData = JSON.parse(Cookies.get('session'));

        if (!sessionData || sessionData.Code === null) {
          const cookies = Cookies.get();
          for (const cookie in cookies) {
            Cookies.remove(cookie);
          }
          console.log('All cookies removed.');
        }
        window.location.reload(true);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form>
        <div className="form-group">
          <label htmlFor="drugMachineCode">Drug Machine Code</label>
          <input
            type="text"
            id="drugMachineCode"
            name="drugMachineCode"
            value={drugMachineCode}
            onChange={handleDrugMachineCodeChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button type="button" onClick={handleLogin}>
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
