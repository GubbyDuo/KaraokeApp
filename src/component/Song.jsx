import "../App.css";

function Song({ song, queue, callBack }) {
    function addToQueue() {
        callBack(song);
    }

    return (
        <div>
            <p className="Song-text Song-inline">
                {song.title.substring(0, 40) + "..."}
            </p>
            <p className="Song-inline Song-gap"> - </p>
            <button onClick={addToQueue}>Add to queue</button>
        </div>
    );
}

export default Song;
