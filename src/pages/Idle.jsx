import React from "react";
import "./Idle.css";
import Logo from "../asset/logo.png"
import IdleImage from "../asset/idle-image.png"

function IdlePage({ socketMessage }) {
  return (
    <div className="idle-page">
      <div className="idle-card">
        <div className="idle-section" style={{ height: '25%' }}>
          <img src={Logo} alt="Logo" />
        </div>
        <div className="idle-section" style={{ height: '50%' }}>
          <img src={IdleImage} alt="IdleImage" />
        </div>
        <div className="idle-text" style={{ height: '25%' }}>
          แมชชีนฮอตดอกคาปูชิโน โปรเจกเตอร์ ฟลุตดยุก ฮิบรูวิวตุ๊ด<br></br>หมิง ศิลปวัฒนธรรมวอลซ์โพสต์สเตอริโอแอสเตอร์ 
        </div>
      </div>
    </div>
  );
}

export default IdlePage;
