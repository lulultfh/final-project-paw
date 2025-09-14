"use client";

import React from "react";

export default function MapLocation() {
  return (
    <div className="w-full h-[400px]">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.801525468704!2d110.32186089999999!3d-7.8108235!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7af80f28426fb3%3A0x72412294845ee8b4!2sMuhammadiyah%20University%20of%20Yogyakarta!5e0!3m2!1sen!2sid!4v1755766314670!5m2!1sen!2sid"
        width="600"
        height="450"
        style={{ border: "0" }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
}