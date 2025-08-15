"use client";
import { useState, useEffect, useRef } from "react";
import "./clock.css";

export default function Home() {
  const [time, setTime] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sosMethod, setSosMethod] = useState("longpress");
  const [nickname, setNickname] = useState("");
  const [longPressNumber, setLongPressNumber] = useState("");
  const [tapSequence, setTapSequence] = useState("");
  const pressStartTimeRef = useRef(null);
  const pressTargetRef = useRef(null);
  const tapTimeoutRef = useRef(null);
  const [tapHistory, setTapHistory] = useState([]);

  //update time
  useEffect(() => {
    function updateClock() {
      const now = new Date();
      const seconds = now.getSeconds();
      const minutes = now.getMinutes();
      const hours = now.getHours();

      const secondDeg = (seconds / 60) * 360;
      const minuteDeg = (minutes / 60) * 360 + (seconds / 60) * 6;
      const hourDeg = (hours / 12) * 360 + (minutes / 60) * 30;

      document.getElementById("second").style.transform = `translate(-50%, -100%) rotate(${secondDeg}deg)`;
      document.getElementById("minute").style.transform = `translate(-50%, -100%) rotate(${minuteDeg}deg)`;
      document.getElementById("hour").style.transform = `translate(-50%, -100%) rotate(${hourDeg}deg)`;
    }

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  //trigger
  function triggerSOS() {
    // Get nicknames list from localStorage
    let nicknames = JSON.parse(localStorage.getItem("nicknames")) || ["Default Contact"];

    // Create message for popup
    let message = "⚠ SOS ALERT ⚠\nSend help request to:\n" + nicknames.join("\n");

    // Show confirmation popup
    if (confirm(message)) {
      // Proceed with sending
      alert("SOS sent successfully!");
      // Here you can add WhatsApp/SMS sending code
    } else {
      alert("SOS canceled.");
    }
  }


  //long press
  const handleNumberMouseDown = (num) => {
    pressStartTimeRef.current = Date.now();
    pressTargetRef.current = num;
  };

  const handleNumberMouseUp = (num) => {
    const pressDuration = Date.now() - pressStartTimeRef.current;
    if (
      sosMethod === "longpress" &&
      num === longPressNumber &&
      pressDuration >= 2000
    ) {
      triggerSOS();
    }
    pressStartTimeRef.current = null;
  };

  //passkey
  // Handle tap sequence
  const handleNumberTap = (num) => {
    if (sosMethod !== "tapsequence") return;

    clearTimeout(tapTimeoutRef.current);

    setTapHistory((prev) => {
      const newHistory = [...prev, num];
      const savedSequence = tapSequence
        .split("-")
        .map((n) => n.trim())
        .filter(Boolean);

      if (newHistory.join(",") === savedSequence.join(",")) {
        triggerSOS();
        return [];
      }

      tapTimeoutRef.current = setTimeout(() => {
        setTapHistory([]);
      }, 5000);

      return newHistory;
    });
  };
  return (

    <div className="clock-container">
      <div className="gear-icon" onClick={() => setIsModalOpen(true)}>⚙️</div>
      <div className="clock">

        <div className="inner-circle"></div>

        <div className="number n12" onMouseDown={() => handleNumberMouseDown("XII")}
  onMouseUp={() => handleNumberMouseUp("XII")}
  onClick={() => handleNumberTap("XII")}>XII</div>

        <div className="number n1" onMouseDown={() => handleNumberMouseDown("I")}
  onMouseUp={() => handleNumberMouseUp("I")}
  onClick={() => handleNumberTap("I")}>I</div>

        <div className="number n2" onMouseDown={() => handleNumberMouseDown("II")}
  onMouseUp={() => handleNumberMouseUp("II")}
  onClick={() => handleNumberTap("II")}>II</div>

        <div className="number n3" onMouseDown={() => handleNumberMouseDown("III")}
  onMouseUp={() => handleNumberMouseUp("III")}
  onClick={() => handleNumberTap("III")}>III</div>

        <div className="number n4" onMouseDown={() => handleNumberMouseDown("IV")}
  onMouseUp={() => handleNumberMouseUp("IV")}
  onClick={() => handleNumberTap("IV")}>IV</div>

        <div className="number n5" onMouseDown={() => handleNumberMouseDown("V")}
  onMouseUp={() => handleNumberMouseUp("V")}
  onClick={() => handleNumberTap("V")}>V</div>

        <div className="number n6" onMouseDown={() => handleNumberMouseDown("VI")}
  onMouseUp={() => handleNumberMouseUp("VI")}
  onClick={() => handleNumberTap("VI")}>VI</div>

        <div className="number n7" onMouseDown={() => handleNumberMouseDown("VII")}
  onMouseUp={() => handleNumberMouseUp("VII")}
  onClick={() => handleNumberTap("VII")}>VII</div>

        <div className="number n8" onMouseDown={() => handleNumberMouseDown("VIII")}
  onMouseUp={() => handleNumberMouseUp("VIII")}
  onClick={() => handleNumberTap("VIII")}>VIII</div>

        <div className="number n9" onMouseDown={() => handleNumberMouseDown("IX")}
  onMouseUp={() => handleNumberMouseUp("IX")}
  onClick={() => handleNumberTap("IX")}>IX</div>

        <div className="number n10" onMouseDown={() => handleNumberMouseDown("X")}
  onMouseUp={() => handleNumberMouseUp("X")}
  onClick={() => handleNumberTap("X")}>X</div>

        <div className="number n11" onMouseDown={() => handleNumberMouseDown("XI")}
  onMouseUp={() => handleNumberMouseUp("XI")}
  onClick={() => handleNumberTap("XI")}>XI</div>

        <div className="hand hour" id="hour"></div>
        <div className="hand minute" id="minute"></div>
        <div className="hand second" id="second"></div>
        <div className="center"></div>
      </div>


      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>SOS Settings</h2>
            <label>
              Nickname:
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </label>

            <label>
              SOS Method:
              <select
                value={sosMethod}
                onChange={(e) => setSosMethod(e.target.value)}
              >
                <option value="longpress">Long Press</option>
                <option value="tapsequence">Tap Sequence</option>
              </select>
            </label>

           {sosMethod === "longpress" && (
  <label>
    Roman Numeral to Long Press (I–XII):
    <input
      type="text"
      pattern="^(I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII)$"
      value={longPressNumber}
      onChange={(e) => setLongPressNumber(e.target.value.toUpperCase())}
      placeholder="e.g., VI"
    />
    <select
      value={longPressNumber}
      onChange={(e) => setLongPressNumber(e.target.value)}
      
    >
      <option value="">-- Select --</option>
      <option value="I">I</option>
      <option value="II">II</option>
      <option value="III">III</option>
      <option value="IV">IV</option>
      <option value="V">V</option>
      <option value="VI">VI</option>
      <option value="VII">VII</option>
      <option value="VIII">VIII</option>
      <option value="IX">IX</option>
      <option value="X">X</option>
      <option value="XI">XI</option>
      <option value="XII">XII</option>
    </select>
  </label>
)}

{sosMethod === "tapsequence" && (
  <label>
    Tap Sequence (Roman Numerals):
    <input
      type="text"
      value={tapSequence}
      onChange={(e) => setTapSequence(e.target.value.toUpperCase())}
      placeholder="e.g., III-VI-IX"
    />
  </label>
)}


            <div className="modal-buttons">
              <button onClick={() => setIsModalOpen(false)}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
