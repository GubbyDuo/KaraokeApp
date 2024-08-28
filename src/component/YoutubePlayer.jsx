import { useState, useEffect, useRef } from "react";

function YoutubePlayer() {
    const [currentVideo, setCurrentVideo] = useState(null);
    const [playerTab, setPlayerTab] = useState(null);

    function playVideoInPlayer(video) {
        let playerTab = openYtPlayer();

        if (playerTab) {
            let videoId = null;
            // Open the YouTube video in the player tab
            playerTab.location.href = `https://www.youtube.com/watch?v=${videoId}`;

            // Send a message to the tab that contains the video ID
            playerTab.onload = function () {
                playerTab.postMessage(
                    { type: "PLAY_VIDEO", videoId: videoId },
                    "*",
                );
            };
        } else {
            console.error("Failed to open player tab");
        }
    }

    function openYtPlayer() {
        if (!playerTab || playerTab.closed) {
            setPlayerTab(window.open("", "_blank"));
        }
        return playerTab;
    }

    function noVideoQueued() {
        console.log("No video queued");
    }

    useEffect(() => {
        const loadYoutubeApi = () => {
            const script = document.createElement("script");
            script.src = "https://www.youtube.com/iframe_api";
            script.async = true;
            document.body.appendChild(script);
        };

        if (!window.YT) {
            loadYoutubeApi();
        } else {
            createPlayer();
        }

        window.onYoutubeIframeAPIReady = () => {
            createPlayer();
        };

        const createPlayer = () => {
            if (!player) {
                new YT.Player("player", {
                    height: "390",
                    width: "640",
                    videoId: "M7lc1UVf-VE", // Example video ID, can be set dynamically
                    events: {
                        onReady: onPlayerReady,
                        onStateChange: onPlayerStateChange,
                    },
                });
            }
        };
    }, []);

    return (
        <div>
            <div className="App-music">
                <button
                    onClick={() => {
                        queue.length < 1
                            ? noVideoQueued()
                            : playVideoInPlayer();
                    }}
                >
                    <img className="App-logo" src={Play} alt="Play-Logo" />
                </button>
                <a>
                    <img className="App-logo" src={Skip} alt="Skip-Logo" />
                </a>
            </div>
        </div>
    );
}

export default YoutubePlayer;
