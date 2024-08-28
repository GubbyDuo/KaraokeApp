import QueueSong from "./QueueSong";

function Queue({ queue, callBack }) {
    function handleClick() {
        callBack();
    }

    return (
        <div>
            <h2>Queue</h2>
            <button onClick={handleClick}>Clear Queue</button>
            {queue.map((song) => (
                <QueueSong song={song} />
            ))}
        </div>
    );
}

export default Queue;
