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
        <div className="idle-section" style={{ height: '25%' }}>
          <div className="idle-text">
            PENSOOK HEALTH CARE TECHNOLOGY CO,.LTD <span className="idle-text-blue">มีความมุ่งมั่น ตั้งใจ พัฒนาเทคโนโลยีทางการแพทย์<br></br>ให้มีประสิทธิภาพมากขึ้น</span> โดยการร่วมพัฒนา โรงพยาบาลและสถานบริการทางการแพทย์ <br></br>เพื่อแบ่งเบาภาระของบุคลากรทางการแพทย์ และพัฒนาคุณภาพชีวิตของผู้คนให้ดียิ่งขึ้น
          </div>
        </div>
      </div>
    </div>
  );
}

export default IdlePage;
