import Song from "./Song";

function List({ playlist, queue, callBack }) {
    return (
        <div>
            <h2>Song List</h2>
            {playlist.map((song) => (
                <Song song={song} queue={queue} callBack={callBack} />
            ))}
        </div>
    );
}

export default List;
