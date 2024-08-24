import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar/Navbar';
import SongList from './components/SongList/SongList';
import MusicPlayer from './components/MusicPlayer/MusicPlayer';
import styles from './App.module.css';

function App() {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const appContainerRef = useRef(null);

  useEffect(() => {
    axios.get('https://cms.samespace.com/items/songs')
      .then(response => {
        setSongs(response.data.data);
        if (response.data.data.length > 0) {
          setCurrentSong(response.data.data[0]);
        }
      })
      .catch(error => console.error('Error fetching songs:', error));
  }, []);

  const handleNext = () => {
    const nextIndex = (currentSongIndex + 1) % songs.length;
    setCurrentSongIndex(nextIndex);
    setCurrentSong(songs[nextIndex]);
  };

  const handlePrevious = () => {
    const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    setCurrentSongIndex(prevIndex);
    setCurrentSong(songs[prevIndex]);
  };

  return (
    <div className={styles.appContainer} ref={appContainerRef}>
      <Navbar className={styles.Navbar}/>
      <SongList songs={songs} setCurrentSong={setCurrentSong} />
      <MusicPlayer 
        currentSong={currentSong} 
        appContainerRef={appContainerRef}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </div>
  );
}

export default App;