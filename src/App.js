import { useEffect, useRef, useState } from "react";
import "./App.css";
import Axios from "axios";
import List from "./component/List";
import "bootstrap/dist/css/bootstrap.min.css";
import Pause from "./pause.svg";
import Play from "./play.svg";
import Skip from "./skip.svg";
import Queue from "./component/Queue";
const ytPlaylistLink =
    "https://iv.ggtyler.dev/api/v1/playlists/PLcUbZ-teAC3I9XGDP7ekQ4wXv3-ycFkGN";

async function loadYoutubePlaylist() {
    return Axios.get(ytPlaylistLink)
        .then(function (response) {
            let ytPlaylist = response.data;
            console.log(ytPlaylist);
            return ytPlaylist;
        })
        .catch(function (error) {
            console.log(error);
        });
}

function App() {
    const [currentVideo, setCurrentVideo] = useState(null);
    const [playlist, setPlaylist] = useState([]);
    const [queue, setQueue] = useState([]);
    const [player, setPlayer] = useState(null);

    function openYtPlayer() {
        let newPlayer = null;
        if (!player || player.closed) {
            newPlayer = window.open("", "_blank");
            setPlayer(newPlayer);
        }
        return newPlayer;
    }

    function playVideoInPlayer() {
        let playerTab = openYtPlayer();

        if (playerTab) {
            let currentVid = queue[0];
            setCurrentVideo(currentVid);

            let videoId = currentVid.videoId;
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

    function noVideoQueued() {
        console.log("No video queued");
    }

    function addSong(song) {
        setQueue((oldQueue) => [...oldQueue, song]);
    }

    function clearQueue(song) {
        setQueue([]);
    }

    function onPlayerReady() {}

    function onPlayerStateChange() {}

    useEffect(() => {
        const loadYoutubeApi = () => {
            const script = document.createElement("script");
            script.src = "https://www.youtube.com/iframe_api";
            script.async = true;
            document.body.appendChild(script);
        };

        const createPlayer = () => {
            if (!player) {
                new window.YT.Player("player", {
                    height: "390",
                    width: "640",
                    videoId: currentVideo, // Example video ID, can be set dynamically
                    events: {
                        onReady: onPlayerReady,
                        onStateChange: onPlayerStateChange,
                    },
                });
            }
        };

        if (!window.YT) {
            loadYoutubeApi();
        } else {
            createPlayer();
        }

        window.onYoutubeIframeAPIReady = () => {
            createPlayer();
        };
    }, []);

    useEffect(() => {
        async function fetchYtPlaylist() {
            let gotPlaylist = await loadYoutubePlaylist();
            setPlaylist(gotPlaylist.videos);
        }
        fetchYtPlaylist();
    }, []);

    return (
        <>
            <div className="App">
                <header className="App-header">
                    <h2 className="App-header-text">Karaoke app</h2>
                    {/* {renderPage()} */}
                    <div className="App-columns">
                        <List
                            className="App-column"
                            playlist={playlist}
                            queue={queue}
                            callBack={addSong}
                        />
                        <Queue
                            className="App-column"
                            queue={queue}
                            callBack={clearQueue}
                        />
                    </div>
                    <div className="App-music">
                        <button
                            onClick={() => {
                                queue.length < 1
                                    ? noVideoQueued()
                                    : playVideoInPlayer();
                            }}
                        >
                            <img
                                className="App-logo"
                                src={Play}
                                alt="Play-Logo"
                            />
                        </button>
                        <a>
                            <img
                                className="App-logo"
                                src={Skip}
                                alt="Skip-Logo"
                            />
                        </a>
                    </div>
                </header>
            </div>
        </>
    );
}

export default App;
