"use client";
import { useState, useEffect, useRef } from "react";
import "./clock.css";

export default function Home() {
  const [time, setTime] = useState(new Date());
  
  //const [sosMethod, setSosMethod] = useState("longpress");

  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // added

  const [nickname, setNickname] = useState("");
  const [numberForNickname, setNumberForNickname] = useState("");
  const [longPressNumber, setLongPressNumber] = useState("");
  const [tapSequence, setTapSequence] = useState("");

  const [contacts, setContacts] = useState([]);

  const pressStartTimeRef = useRef(null);

  //const pressTargetRef = useRef(null);

  const tapTimeoutRef = useRef(null);
  const [tapHistory, setTapHistory] = useState([]);
  const sosTriggeredRef = useRef(false);

   // Load data from localStorage on app start //added
  useEffect(() => {
    const savedContacts = JSON.parse(localStorage.getItem("contacts")) || [];
    setContacts(savedContacts);

  }, []);

  //update time
  useEffect(() => {
    if (isSettingsOpen) return; //added

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
  }, [isSettingsOpen]);

  //trigger
  const sendSOS = (contact) => {
  if (!contact) {
    alert("⚠ No matching contact found!");
    return;
  }

  let message = `⚠ SOS ALERT ⚠\nSending help to:\n${contact.nickname} (${contact.number})`;

  if (confirm(message)) {
    alert("✅ SOS sent successfully!");
  } else {
    alert("❌ SOS canceled.");
  }

  if (!contact?.number) {
    toast.error("No valid contact number saved for this action");
    return;
  }

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const locationText = `⚠ SOS ALERT ⚠\nI need help!\nMy location: https://maps.google.com/?q=${latitude},${longitude}`;

        // open WhatsApp chat for the matched contact
        window.open(
          `https://wa.me/${contact.number}?text=${encodeURIComponent(locationText)}`,
          "_blank"
        );
      },
      () => {
        toast.error("Could not fetch location");
      }
    );
  } else {
    toast.error("Geolocation is not supported on this device");
  }
};


/* function triggerSOS() {
  if (sosTriggeredRef.current) return;
  sosTriggeredRef.current = true;

  if (contacts.length > 0) {
    let message = `⚠ SOS ALERT ⚠\nSend help request to:\n${contacts[0].nickname}`;
    if (confirm(message)) {
      alert("SOS sent successfully!");
    } else {
      alert("SOS canceled.");
    }
  }

  setTimeout(() => (sosTriggeredRef.current = false), 500);
} */


  //long press
  const handleNumberMouseDown = (num) => {
     pressStartTimeRef.current = { time: Date.now(), num };
    
    //pressTargetRef.current = num;
  };

const handleNumberMouseUp = (num) => {
  const pressData = pressStartTimeRef.current;
  if (!pressData) return;

  const pressDuration = Date.now() - pressData.time;

  if (pressDuration > 800) { // 0.8s long press
    const matchedContact = contacts.find(c => c.longPressNumber === num);
    if (matchedContact) {
      sendSOS(matchedContact);
    }
  }

  pressStartTimeRef.current = null;
};



 /*const handleNumberMouseUp = (num) => {
    const pressData = pressStartTimeRef.current;
    if (!pressData) return;
    const duration = Date.now() - pressData.time;
    if (duration >= 2000) {
      const match = contacts.find(c => c.longPressNumber === num);
    if (match) {
      triggerSOS();
    }
    }
    pressStartTimeRef.current = null;
  }; */



  
  // Handle tap sequence
  const handleNumberTap = (num) => {
  clearTimeout(tapTimeoutRef.current);

  setTapHistory((prev) => {
    const newHistory = [...prev, num];
    let matchedContact = null;

    for (let c of contacts) {
      const savedSequence = c.tapSequence
        .split("-")
        .map((n) => n.trim())
        .filter(Boolean);

      if (newHistory.join(",") === savedSequence.join(",")) {
        matchedContact = c;
        break;
      }
    }

    if (matchedContact) {
      // run SOS after render (avoids double confirm box)
      setTimeout(() => {
        if (!sosTriggeredRef.current) {
          sosTriggeredRef.current = true;
          sendSOS(matchedContact);
          setTimeout(() => (sosTriggeredRef.current = false), 500);
        }
      }, 50);

      return [];
    }

    tapTimeoutRef.current = setTimeout(() => {
      setTapHistory([]);
    }, 5000);

    return newHistory;
  });
};



  //added
  const saveContact = () => {
  if (!nickname || !numberForNickname) {
    alert("⚠ Please enter both nickname and number before saving!");
    return;
  }

  let savedContacts = JSON.parse(localStorage.getItem("contacts")) || [];

  savedContacts = savedContacts.filter(c => c.nickname && c.number);
  

  const newContact = {
    nickname,
    number: numberForNickname,
    longPressNumber,
    tapSequence,
  };

  savedContacts.push(newContact);
  localStorage.setItem("contacts", JSON.stringify(savedContacts));
  setContacts(savedContacts);

  // clear fields
  setNickname("");
  setNumberForNickname("");
  setLongPressNumber("");
  setTapSequence("");

  alert("✅ Contact saved!");
  setIsSettingsOpen(false);
};

 //added
  const handleDeleteContact = (index) => {
  let savedContacts = JSON.parse(localStorage.getItem("contacts")) || [];
  savedContacts.splice(index, 1); // remove selected
  localStorage.setItem("contacts", JSON.stringify(savedContacts));
  setContacts(savedContacts);
};

  //added
   if (isSettingsOpen) {
    return (
      <div className="settings-page">
        <h2>SOS Settings</h2>
        <br></br>
        <br></br>
        <label>
          Nickname:
          <input value={nickname} onChange={(e) => setNickname(e.target.value)} />
        </label>
        <br></br>
        <br></br>
        <label>
          Number:
          <input
      type="tel"
      pattern=""
      maxLength="10" required
      value={numberForNickname}
      onChange={(e) => setNumberForNickname(e.target.value.toUpperCase())}
      />
  
        </label>

        
<br></br>
        <br></br>
        <label>
          Long Press Roman:
          
    <input
      type="text"
      pattern="^(I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII)$"
      value={longPressNumber}
      onChange={(e) => setLongPressNumber(e.target.value.toUpperCase())}
      placeholder="e.g., VI"
    />

          <select value={longPressNumber} onChange={(e) => setLongPressNumber(e.target.value)}>
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
<br></br>
<br></br>
        <label>
          Tap Sequence (Roman Numerals, dash separated):
          <input value={tapSequence} onChange={(e) => setTapSequence(e.target.value.toUpperCase())} placeholder="III-VII-VII" />
        </label>
<br></br>
<br></br>
<button onClick={saveContact}>Save Contact</button>
<br></br>
     <br></br>
     <h3>Saved Contacts:</h3>

      <ul>
  {contacts.map((c, idx) => (
    <li key={idx}>
      {c.nickname} ({c.number}) → Long: {c.longPressNumber}, Tap: {c.tapSequence}
      <button onClick={() => handleDeleteContact(idx)}>❌</button>
    </li>
  ))}
</ul>


      <br></br>
      <br></br>
        <button onClick={() => setIsSettingsOpen(false)}>Back to Clock</button>
      </div>
    );
  }

 

  return (

    <div className="clock-container">
      <div className="gear-icon" onClick={() => setIsSettingsOpen(true)}>⚙️</div>
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
</div>
  );
}
