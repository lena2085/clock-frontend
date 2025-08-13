"use client";
import { useEffect } from "react";
import "./clock.css";

export default function Home() {
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

  return (
    <div className="clock">
      <div className="inner-circle"></div>
      <div className="number n12">XII</div>
      <div className="number n1">I</div>
      <div className="number n2">II</div>
      <div className="number n3">III</div>
      <div className="number n4">IV</div>
      <div className="number n5">V</div>
      <div className="number n6">VI</div>
      <div className="number n7">VII</div>
      <div className="number n8">VIII</div>
      <div className="number n9">IX</div>
      <div className="number n10">X</div>
      <div className="number n11">XI</div>

      <div className="hand hour" id="hour"></div>
      <div className="hand minute" id="minute"></div>
      <div className="hand second" id="second"></div>
      <div className="center"></div>
    </div>
  );
}
