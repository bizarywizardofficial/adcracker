/*global chrome*/
import "./App.css";
import Logo from "./static-assets/logo.png";
import Loading from "./static-assets/loading.gif";
import { useEffect, useState } from "react";

function App() {
  const [isButtonpaused, setIsButtonpaused] = useState("loading");
  useEffect(() => {
    chrome.storage.local.get(["paused"], (result) => {
      setIsButtonpaused(result.paused);
    });
  }, []);

  const togglePause = () => {
    const element = document.getElementById("pause-button");
    if (isButtonpaused === true) {
      element.classList.add("is-active");
      chrome.runtime.sendMessage({ action: "resume" }, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error sending message:", chrome.runtime.lastError);
        } else {
          setIsButtonpaused(false);
        }
      });
    } else {
      element.classList.remove("is-active");
      chrome.runtime.sendMessage({ action: "pause" }, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error sending message:", chrome.runtime.lastError);
        } else {
          setIsButtonpaused(true);
        }
      });
    }
  };

  return (
    <div id="adblock-popup" class="adblock-popup">
      <header class="popup-header">
        <div class="logo-container">
          <img src={Logo} height="75px"></img>
          <h1 class="extension-name">Ad-crusher</h1>
        </div>
      </header>

      <main class="main-control-section">
        {isButtonpaused === "loading" ? (
          <img height={"100px"} src={Loading}></img>
        ) : (
          <button
            id="pause-button"
            class={
              isButtonpaused !== true
                ? "pause-button is-active"
                : "pause-button"
            }
            onClick={togglePause}
          >
            <span class="button-icon-wrapper">
              <svg
                class="icon-play"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              <svg
                class="icon-pause"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
              </svg>
            </span>
            <span class="button-text-status">Blocking Ads</span>
            <span class="button-text-action">Click to Pause</span>
          </button>
        )}
      </main>

      <section class="stats-section">
        <div class="stat-card">
          <span class="stat-number">
            <img src={Loading} height="30px"></img>
          </span>
          <span class="stat-label">Ads Blocked Today</span>
        </div>
      </section>

      <footer class="popup-footer">
        <a href="#" class="settings-link">
          Settings
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9.09A1.65 1.65 0 0 0 10 4.6l-.09-.06A2 2 0 0 1 12 3a2 2 0 0 1 2 2v.09A1.65 1.65 0 0 0 15 7.4a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V15z"></path>
          </svg>
        </a>
      </footer>
    </div>
  );
}

export default App;
