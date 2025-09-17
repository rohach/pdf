import React from "react";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <p>
        © {new Date().getFullYear()} Rohan Chaulagain. All rights reserved.
        Visit:{" "}
        <a
          href="https://www.rohanchaulagain.com.np"
          target="_blank"
          rel="noopener noreferrer"
        >
          www.rohanchaulagain.com.np
        </a>
      </p>
    </footer>
  );
};

export default Footer;
