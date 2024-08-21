import React, { useState, useEffect } from 'react';
import styles from './SongList.module.css';
import { FaSearch } from 'react-icons/fa';

const SongList = ({ songs, setCurrentSong }) => {
  const [durations, setDurations] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSongs, setFilteredSongs] = useState(songs);

  const getSongDuration = (url, id) => {
    const audio = new Audio(url);
    audio.addEventListener('loadedmetadata', () => {
      const duration = audio.duration;
      const minutes = Math.floor(duration / 60);
      const seconds = Math.floor(duration % 60);
      const formattedDuration = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      setDurations((prevDurations) => ({ ...prevDurations, [id]: formattedDuration }));
    });
  };

  useEffect(() => {
    songs.forEach((song) => {
      if (!durations[song.id]) {
        getSongDuration(song.url, song.id);
      }
    });
  }, [songs, durations]);

  useEffect(() => {
    setFilteredSongs(
      songs.filter((song) =>
        song.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, songs]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchClick = () => {
    setFilteredSongs(
      songs.filter((song) =>
        song.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };

  return (
    <div className={styles.Container}>
      <div>
        <h2 className={styles.header}>
          <span>For You</span>
          <span style={{ opacity: "0.6" }}>Top Tracks</span>
        </h2>
      </div>
      <div className={styles.search}>
        <input
          type="text"
          placeholder="Search Song, Artist"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <FaSearch className={styles.searchIcon} onClick={handleSearchClick} />
      </div>
      <div className={styles.songListContainer}>
        {filteredSongs.map((song) => (
          <div
            key={song.id}
            className={styles.songItem}
            onClick={() => setCurrentSong(song)}
          >
            <div className={styles.songCont}>
              <img
                src={`https://cms.samespace.com/assets/${song.cover}`}
                alt=""
                className={styles.img}
              />
              <div className={styles.textContainer}>
                <h2>{song.name}</h2>
                <p>{song.artist}</p>
              </div>
              <div className={styles.duration}>
                <p>
                  {durations[song.id]}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SongList;
