import React, { useState, useEffect } from 'react';
import styles from './SongList.module.css';
import { FaSearch, FaBars } from 'react-icons/fa';

const SongList = ({ songs, setCurrentSong }) => {
  const [durations, setDurations] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSongs, setFilteredSongs] = useState(songs);
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isTopTracksView, setIsTopTracksView] = useState(false);

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
    const lowerCaseQuery = searchQuery.toLowerCase();
    setFilteredSongs(
      songs.filter((song) =>
        song.name.toLowerCase().includes(lowerCaseQuery) ||
        song.artist.toLowerCase().includes(lowerCaseQuery)
      )
    );
  }, [searchQuery, songs]);

  const topTracks = songs.filter(song => song.top_track);

  return (
    <div className={`${styles.Container} ${isMenuOpen ? styles.menuOpen : ''}`}>
      <div className={styles.headerContainer}>
        <h2 className={styles.header}>
          <span
            onClick={() => setIsTopTracksView(false)}
            style={{ cursor: 'pointer', opacity: isTopTracksView ? '0.6' : '1' }}
          >
            For You
          </span>
          <span
            onClick={() => setIsTopTracksView(true)}
            style={{ cursor: 'pointer', opacity: isTopTracksView ? '1' : '0.6' }}
          >
            Top Tracks
          </span>
        </h2>
        <FaBars
          className={styles.hamburgerIcon}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        />
      </div>
      <div className={styles.search}>
        <input
          type="text"
          placeholder="Search Song, Artist"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <FaSearch className={styles.searchIcon} />
      </div>

      <div className={styles.songListContainer}>
        {(isTopTracksView ? topTracks : filteredSongs).map((song) => (
          <div
            key={song.id}
            className={styles.songItem}
            onClick={() => setCurrentSong(song)}
          >
            <div className={styles.songCont}>
              <img
                src={`https://cms.samespace.com/assets/${song.cover}`}
                alt={song.name}
                className={styles.img}
              />
              <div className={styles.textContainer}>
                <h2>{song.name}</h2>
                <p>{song.artist}</p>
              </div>
              <div className={styles.duration}>
                <p>{durations[song.id]}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SongList;