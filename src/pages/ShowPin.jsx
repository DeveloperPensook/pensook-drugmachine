import React, { useState, useEffect } from "react";
import "./ShowPin.css";
import Logo from "../asset/logo.png";

function ShowPin({ socketMessage }) {
  const [countdown, setCountdown] = useState(300); // Initial countdown value is 300 seconds
  const [dateStr, setDateStr] = useState();
  const monthTH = {
    1: "มกราคม",
    2: "กุมภาพันธ์",
    3: "มีนาคม",
    4: "เมษายน",
    5: "พฤษภาคม",
    6: "มิถุนายน",
    7: "กรกฎาคม",
    8: "สิงหาคม",
    9: "กันยายน",
    10: "ตุลาคม",
    11: "พฤศจิกายน",
    12: "ธันวาคม",
  };

  useEffect(() => {
    let createTime = new Date(socketMessage.createTime);
    setDateStr(
      `วันที่ ${createTime.getDate()} เดือน ${
        monthTH[createTime.getMonth() + 1]
      } ${createTime.getFullYear() + 543} | เวลา ${
        createTime.getHours() > 9
          ? createTime.getHours()
          : "0" + createTime.getHours()
      }:${
        createTime.getMinutes() > 9
          ? createTime.getMinutes()
          : "0" + createTime.getMinutes()
      } น.`
    );
    const timer = setInterval(() => {
      if (countdown > 0) {
        setCountdown(countdown - 1);
      } else {
        // When the countdown reaches 0, make the POST request
        clearInterval(timer); // Clear the timer
        callService(); // Call the service
      }
    }, 1000);

    return () => clearInterval(timer); // Cleanup the timer on component unmount
  }, [countdown]);

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  const callService = () => {
    const requestBody = { pin: socketMessage.pin, closeStatus: "Pin Failed" };
    const BACKEND_URL = process.env.REACT_APP_IS_PROD  == 'true'
      ? process.env.REACT_APP_BACKEND_URL_PROD
      : process.env.REACT_APP_BACKEND_URL
    fetch(`${BACKEND_URL}/auth/closeEntryOnPin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (response.ok) {
          console.log('POST request successful');
          window.location.reload(true);
        } else {
          console.error('POST request failed');
        }
      })
      .catch((error) => {
        console.error('Network error:', error);
      });
  };

  return (
    <div className="showpin-page">
      <div className="showpin-card">
        <div className="showpin-section" style={{ height: "25%" }}>
          <img src={Logo} alt="Logo" />
        </div>
        <div className="showpin-detail" style={{ height: "25%", width: "80%" }}>
          <div>
            วันที่&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span className="showpin-detail-bold">{dateStr}</span>
          </div>
          <div>
            กิจกรรม&nbsp;&nbsp;&nbsp;: &nbsp;&nbsp;&nbsp;&nbsp;
            <span className="showpin-detail-bold">
              {socketMessage.activity}
            </span>
          </div>
          {socketMessage.activity === 'เปิดตู้ยา' && (
            <div>
              หมายเหตุ&nbsp;&nbsp;: &nbsp;&nbsp;&nbsp;&nbsp;
              <span className="showpin-detail-bold">
                {socketMessage.remark}
              </span>
            </div>
          )}
          <div>
            ผู้ใช้งาน&nbsp;&nbsp;&nbsp;&nbsp;: &nbsp;&nbsp;&nbsp;&nbsp;
            <span className="showpin-detail-bold">{socketMessage.user}</span>
          </div>
        </div>
        <div className="showpin-section" style={{ height: "10%" }}>
          <div className="showpin-center-text">หมายเลข PIN</div>
        </div>
        <div className="showpin-section" style={{ height: "30%" }}>
          <div className="showpin-pin-text">{socketMessage.pin}</div>
        </div>
        <div className="showpin-section" style={{ height: "10%" }}>
          <div className="showpin-pin-text-footer">
            {minutes}:{seconds > 9 ? seconds : "0" + seconds}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowPin;
