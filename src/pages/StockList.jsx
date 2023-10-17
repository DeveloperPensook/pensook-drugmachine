import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import OpenIcon from "../asset/close-icon.png";
import "./StockList.css";

function StockList({ socketMessage }) {
  let tableData = [];
  let headerMessage =
    socketMessage.entryType === "Pickup Medicine"
      ? "โปรดรอรับยา"
      : socketMessage.entryType === "Add Stock"
      ? "กรุณาเติมยาเข้าสู่ตู้เก็บยา"
      : "";
  let stockList = socketMessage.stockList;
  if (stockList.length > 0) {
    for (const row of stockList) {
      tableData.push({
        position: row.position,
        medicine_code: row.medicineName,
        qty: `${row.qty} ${row.uom}`,
      });
    }
  }
  let showBtn = process.env.REACT_APP_MODBUS_TEST === "false" ? true : false;

  useEffect(() => {
    if (process.env.REACT_APP_MODBUS_TEST === "true") {
      const sessionValue = Cookies.get("session");
      const decodedString = decodeURIComponent(sessionValue);
      const cookieSession = JSON.parse(decodedString);
      let address = [];
      let value = [];
      if (socketMessage.entryType === "Pickup Medicine") {
        socketMessage.stockList.forEach(function (row) {
          address.push(row.slotAddress);
          value.push(Math.abs(row.qty));
        });
      } else {
        address = [`${cookieSession.openDoorAddress}`];
        value = ["1"];
      }
      let requestData = {
        ip: cookieSession.ipAddress,
        modbusPort: cookieSession.port,
        slaveId: cookieSession.slaveId,
        address: address,
        value: value,
        drugMachineCode: socketMessage.drugMachineCode,
        entryStatusAddress: cookieSession.entryStatusAddress,
        doorStatusAddress: cookieSession.doorStatusAddress,
        entryType: socketMessage.entryType,
      };

      axios
        .post(
          `http://localhost:6007/api/stockLedger/drugMachineModbus`,
          requestData
        )
        .then((response) => {
          if (response.data.response.success) {
            updateStatusToApproved();
          } else {
            closeEntryOnError();
          }
        })
        .catch((error) => {
          closeEntryOnError();
        });
    }
  }, [socketMessage]);

  const closeEntryOnError = () => {
    const BACKEND_URL =
      process.env.REACT_APP_IS_PROD === "true"
        ? process.env.REACT_APP_BACKEND_URL_PROD
        : process.env.REACT_APP_BACKEND_URL;

    axios
      .post(`${BACKEND_URL}/auth/closeEntryOnPin`, {
        pin: socketMessage.pin,
        closeStatus: "Error Closed",
      })
      .then((secondResponse) => {
        console.log(secondResponse);
      })
      .catch((secondError) => {
        console.error(secondError);
      });
  };

  const updateStatusToApproved = () => {
    const BACKEND_URL =
      process.env.REACT_APP_IS_PROD === "true"
        ? process.env.REACT_APP_BACKEND_URL_PROD
        : process.env.REACT_APP_BACKEND_URL;

    axios
      .post(`${BACKEND_URL}/auth/closeEntryOnSuccess`, {
        pin: socketMessage.pin,
      })
      .then((secondResponse) => {
        console.log(secondResponse);
      })
      .catch((secondError) => {
        console.error(secondError);
      });
  };
  const renderTable = (data) => {
    if (data.length === 0) {
      return null;
    }

    const tableStyle = {
      borderCollapse: "collapse",
      width: "100%",
    };

    const columnHeaderStyle = {
      backgroundColor: "#D6EAFF",
      height: "40px",
      textAlign: "center",
      border: "1px solid #D6EAFF",
    };

    const columnTextStyle = {
      color: "#007DFC",
      fontFamily: "IBM Plex Sans Thai, sans-serif",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "16px",
      lineHeight: "24px",
      letterSpacing: "-0.006em",
    };

    const medicineCodeStyle = {
      fontFamily: "IBM Plex Sans Thai, sans-serif",
      letterSpacing: "-0.006em",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "14px",
      lineHeight: "24px",
      color: "#252C32",
    };

    const qtyStyle = {
      fontFamily: "IBM Plex Sans Thai, sans-serif",
      letterSpacing: "-0.006em",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "14px",
      lineHeight: "24px",
      color: "#252C32",
      textAlign: "center",
    };

    const columnWidths = {
      slot: "120px",
      name: "170px",
      quantity: "110px",
    };

    const dataRowStyle = {
      height: "45px",
      borderBottom: "1px solid #E5E9EB",
      borderLeft: "1px solid #E5E9EB",
      borderRight: "1px solid #E5E9EB",
    };
    const positionStyle = {
      ...columnTextStyle,
      width: columnWidths.slot,
      textAlign: "center",
      color: "#000000",
    };

    return (
      <table style={tableStyle}>
        <thead>
          <tr style={columnHeaderStyle}>
            <th style={{ ...columnTextStyle, width: columnWidths.slot }}>
              หมายเลข Slot
            </th>
            <th style={{ ...columnTextStyle, width: columnWidths.name }}>
              ชื่อสารสำคัญ
            </th>
            <th style={{ ...columnTextStyle, width: columnWidths.quantity }}>
              จำนวน
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} style={dataRowStyle}>
              <td style={positionStyle}>{item.position}</td>
              <td style={medicineCodeStyle}>{item.medicine_code}</td>
              <td style={qtyStyle}>{item.qty}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="stocklist-page">
      <div className="stocklist-card">
        <div className="stocklist-section" style={{ height: "5%" }}>
          <div className="stocklist-header">{headerMessage}</div>
          {showBtn ? (
            <button onClick={updateStatusToApproved}>
              Update Status to Approved
            </button>
          ) : null}
        </div>
        <div className="stocklist-section" style={{ height: "95%" }}>
          <div className="stocklist-section" style={{ width: "33.3%" }}>
            <div className="stocklist-table-left">
              {renderTable(tableData.slice(0, 12))}
            </div>
          </div>
          <div className="stocklist-section" style={{ width: "33.4%" }}>
            <div className="stocklist-table-center">
              {renderTable(tableData.slice(12, 24))}
            </div>
          </div>
          <div className="stocklist-section" style={{ width: "33.3%" }}>
            <div className="stocklist-table-right">
              {renderTable(tableData.slice(24, 36))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StockList;
