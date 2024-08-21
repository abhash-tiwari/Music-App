import React, { useState, useRef, useEffect } from 'react';
import { FastAverageColor } from 'fast-average-color';
import styles from './MusicPlayer.module.css';
import dot from '../../assets/Group 7.png';
import sound from '../../assets/Frame.png';
import pre from '../../assets/Vector.png';
import play from '../../assets/Vector (2).png';
import pause from '../../assets/Frame 32.png';
import next from '../../assets/Vector (7).png';

const MusicPlayer = ({ currentSong }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [backgroundColor, setBackgroundColor] = useState('#000');
  const audioRef = useRef(null);
  const fac = new FastAverageColor();

  useEffect(() => {
    if (audioRef.current) {
      const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current.currentTime);
      };
      const handleLoadedMetadata = () => {
        setDuration(audioRef.current.duration);
      };

      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);

      return () => {
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, [currentSong]);

  useEffect(() => {
    if (currentSong) {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = `https://cms.samespace.com/assets/${currentSong.cover}`;
      img.onload = () => {
        const color = fac.getColor(img);
        setBackgroundColor(color.hex);
        document.body.style.background = `linear-gradient(135deg, ${color.hex}, #000)`;
      };
    }
  }, [currentSong]);

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleMute = () => {
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (e) => {
    const seekTime = e.target.value;
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleNext = () => {
    console.log('Next song');
  };

  const handlePrevious = () => {
    console.log('Previous song');
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className={styles.playerContainer}>
      {currentSong ? (
        <>
          <div className={styles.songDetails}>
            <div className={styles.songTitle}>{currentSong.name}</div>
            <div className={styles.songArtist}>{currentSong.artist}</div>
          </div>
          <div className={styles.albumArtContainer}>
            <img src={`https://cms.samespace.com/assets/${currentSong.cover}`} alt={currentSong.name} className={styles.albumArt} />
          </div>

          <div className={styles.seekerContainer}>
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={handleSeek}
              className={styles.seeker}
            />
            <div className={styles.timeInfo}>
              <span>{formatTime(currentTime)}</span>
            </div>
          </div>
          <div className={styles.controls}>
            <div>
              <img src={dot} alt="dot" />
            </div>
            <div className={styles.icns}>
              <img src={pre} alt="Previous" className={styles.controlIcon} onClick={handlePrevious} />
              {isPlaying ? (
                <img src={pause} alt="Pause" className={styles.controlIcon} onClick={handlePlayPause} />
              ) : (
                <img src={play} alt="Play" className={styles.controlIcon} onClick={handlePlayPause} />
              )}
              <img src={next} alt="Next" className={styles.controlIcon} onClick={handleNext} />
            </div>
            <div>
              <img
                src={isMuted ? sound : sound}
                alt="Sound"
                onClick={handleMute}
                className={styles.soundIcon}
              />
            </div>
          </div>
          <audio ref={audioRef} src={currentSong.url} />
        </>
      ) : (
        <p>Select a song to play</p>
      )}
    </div>
  );
};

export default MusicPlayer;
