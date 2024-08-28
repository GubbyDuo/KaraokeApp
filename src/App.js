import { useEffect, useRef, useState } from "react";
import "./App.css";
import Axios from "axios";
import List from "./component/List";
import "bootstrap/dist/css/bootstrap.min.css";
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
    const [playlist, setPlaylist] = useState([]);
    const [queue, setQueue] = useState([]);
    // const [player, setPlayer] = useState(null);
    const playerRef = useRef(null);

    function openYtPlayer() {
        const features = "width=1280,height=720";
        if (!playerRef.current || playerRef.current.closed) {
            const newPlayer = window.open("", "_blank", features);
            if (newPlayer) {
                playerRef.current = newPlayer;
            } else {
                console.error("Failed to open a new player tab.");
            }
        } else {
            playerRef.current.focus();
        }
        return playerRef.current;
    }

    function playVideoInPlayer() {
        let playerTab = openYtPlayer();

        if (playerTab) {
            let currentVid = queue[0];
            setQueue((prevQueue) => {
                let newQueue = [...prevQueue];
                newQueue.shift();
                return newQueue;
            });
            let videoId = currentVid.videoId;
            // Open the YouTube video in the player tab
            playerTab.location.href = `https://www.youtube.com/watch?v=${videoId}`;
        } else {
            console.error("Failed to open player tab");
        }
    }

    function skipToNextSong() {
        let playerTab = openYtPlayer();

        if (playerTab) {
            let currentVid = queue[0];
            setQueue((prevQueue) => {
                let newQueue = [...prevQueue];
                newQueue.shift();
                return newQueue;
            });
            let videoId = currentVid.videoId;
            // Open the YouTube video in the player tab
            playerTab.location.href = `https://www.youtube.com/watch?v=${videoId}`;
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
                        <button
                            onClick={() => {
                                queue.length < 1
                                    ? noVideoQueued()
                                    : skipToNextSong();
                            }}
                        >
                            <img
                                className="App-logo"
                                src={Skip}
                                alt="Skip-Logo"
                            />
                        </button>
                    </div>
                </header>
            </div>
        </>
    );
}

export default App;
