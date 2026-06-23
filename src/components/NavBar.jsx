import { useState, useEffect } from "react";

import { navLinks } from "../constants";

const NavBar = () => {
  // track if the user has scrolled down the page
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // create an event listener for when the user scrolls
    const handleScroll = () => {
      // check if the user has scrolled down at least 10px
      // if so, set the state to true
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    // add the event listener to the window
    window.addEventListener("scroll", handleScroll);

    // cleanup the event listener when the component is unmounted
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? "scrolled" : "not-scrolled"}`}>
      <div className="inner">
        <a href="#hero" className="logo" onClick={() => setIsOpen(false)}>
          Omar Ashraf
        </a>

        <nav className="desktop">
          <ul>
            {navLinks.map(({ link, name }) => (
              <li key={name} className="group">
                <a href={link}>
                  <span>{name}</span>
                  <span className="underline" />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a href="#contact" className="contact-btn group">
          <div className="inner">
            <span>Contact me</span>
          </div>
        </a>

        {/* Mobile Menu Toggle Button */}
        <button
          className="menu-toggle"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle Navigation Menu"
        >
          <img
            src={isOpen ? "/images/x.svg" : "/images/menu.svg"}
            alt="menu toggle"
            className="w-6 h-6 object-contain"
          />
        </button>
      </div>

      {/* Mobile Menu Container */}
      <div className={`mobile-menu-container ${isOpen ? "open" : ""}`}>
        <ul>
          {navLinks.map(({ link, name }) => (
            <li key={name}>
              <a href={link} onClick={() => setIsOpen(false)}>
                {name}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#contact"
              className="mobile-contact-link"
              onClick={() => setIsOpen(false)}
            >
              Contact me
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default NavBar;
