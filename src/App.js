import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar/Navbar';
import SongList from './components/SongList/SongList';
import MusicPlayer from './components/MusicPlayer/MusicPlayer';
import styles from './App.module.css';

function App() {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);

  useEffect(() => {
    axios.get('https://cms.samespace.com/items/songs')
      .then(response => setSongs(response.data.data))
      .catch(error => console.error('Error fetching songs:', error));
  }, []);

  return (
    <div className={styles.appContainer}>
      <Navbar />
        <SongList songs={songs} setCurrentSong={setCurrentSong} />
        <MusicPlayer currentSong={currentSong} />
      
    </div>
  );
}

export default App;
