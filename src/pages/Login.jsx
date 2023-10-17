import React, { useState } from "react";
import Cookies from "js-cookie";
import "./Login.css";
import Logo from "../asset/logo.png";

function Login() {
  const [drugMachineCode, setDrugMachineCode] = useState("");
  const [password, setPassword] = useState("");
  const [showErr, setShowErr] = useState(false);
  const [errText, setErrText] = useState("");

  const handleDrugMachineCodeChange = (e) => {
    setDrugMachineCode(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = () => {
    const backendURL =
      process.env.REACT_APP_IS_PROD == "true"
        ? process.env.REACT_APP_BACKEND_URL_PROD
        : process.env.REACT_APP_BACKEND_URL;

    fetch(`${backendURL}/auth/loginDrugMachine`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        drugMachineCode: drugMachineCode,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setShowErr(true)
          if (data.error == 'Incorrect password') {
            setErrText('รหัสผ่านไม่ถูกต้อง')
          } else {
            setErrText('ไม่พบหมายเลขตู้ยา')
          }
        } else {
          Cookies.set("session", JSON.stringify(data.result.drugMachine));

          const sessionData = JSON.parse(Cookies.get("session"));
  
          if (!sessionData || sessionData.Code === null) {
            const cookies = Cookies.get();
            for (const cookie in cookies) {
              Cookies.remove(cookie);
            }
            console.log("All cookies removed.");
          }
          window.location.reload(true);
        }
      })
      .catch((error) => {
        setShowErr(true)
        setErrText('กำลังปรับปรุงระบบ')
        console.error("Error:", error);
      });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    // <div className="login-container">
    //   <h2>Login</h2>
    //   <form>
    //     <div className="form-group">
    //       <label htmlFor="drugMachineCode">Drug Machine Code</label>
    //       <input
    //         type="text"
    //         id="drugMachineCode"
    //         name="drugMachineCode"
    //         value={drugMachineCode}
    //         onChange={handleDrugMachineCodeChange}
    //       />
    //     </div>
    //     <div className="form-group">
    //       <label htmlFor="password">Password</label>
    //       <input
    //         type="password"
    //         id="password"
    //         name="password"
    //         value={password}
    //         onChange={handlePasswordChange}
    //       />
    //     </div>
    //     <button type="button" onClick={handleLogin}>
    //       Login
    //     </button>
    //   </form>
    // </div>
    <div className="login-page">
      <div className="login-card2">
        <div className="login-section" style={{ height: "60%" }}>
          <div className="login-header3">
            PENSOOK 💡 
            <br></br>HEALTH CARE 
            <br></br>ชีวิตดี ๆ เริ่มต้นที่ <span className="login-header3-black">เป็นสุข</span>
          </div>
        </div>
        <div className="login-section" style={{ height: "40%" }}>
          <div className="login-header4">
          แมชชีนฮอตดอกคาปูชิโน โปรเจกเตอร์ ฟลุตดยุก ฮิบรูวิวตุ๊ด
          <br></br>หมิง ศิลปวัฒนธรรมวอลซ์โพสต์สเตอริโอแอสเตอร์ 
          </div>
        </div>
      </div>
      <div className="login-card">
        <div className="login-section" style={{ height: "15%" }}>
          <img src={Logo} alt="Logo" />
        </div>
        <div className="login-section" style={{ height: "15%" }}>
          <div className="login-header">เข้าสู่ระบบ</div>
          <div className="login-header2">
            ลงทะเบียนเพื่อเข้าใช้งาน platform PENSOOK
          </div>
        </div>
        <div className="login-section" style={{ height: "70%" }}>
          <form className="form-section" onSubmit={handleFormSubmit}>
            <div className="form-group" style={{ height: "30%" }}>
              <label htmlFor="drugMachineCode">หมายเลขตู้เก็บยา</label>
              <input
                type="text"
                id="drugMachineCode"
                name="drugMachineCode"
                value={drugMachineCode}
                onChange={handleDrugMachineCodeChange}
              />
            </div>
            <div className="form-group" style={{ height: "30%" }}>
              <label htmlFor="password">รหัสผ่าน</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
            <div className="form-group" style={{ height: "5%" }}>
              <div className="error-text">{errText}</div>
            </div>
            <button type="submit">
              <div className="button-text">เข้าสู่ระบบ</div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
