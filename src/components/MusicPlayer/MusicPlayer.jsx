import React, { useState, useRef, useEffect } from 'react';
import { FastAverageColor } from 'fast-average-color';
import styles from './MusicPlayer.module.css';
import dot from '../../assets/Group 7.png';
import sound from '../../assets/Frame.png';
import pre from '../../assets/Vector.png';
import play from '../../assets/Vector (2).png';
import pause from '../../assets/Frame 32.png';
import next from '../../assets/Vector (7).png';

const MusicPlayer = ({ currentSong, appContainerRef, onNext, onPrevious }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [backgroundColor, setBackgroundColor] = useState('');
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef(null);
  const fac = new FastAverageColor();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    if (currentSong && audioRef.current) {
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
        if (appContainerRef.current) {
          appContainerRef.current.style.background = `linear-gradient(135deg, ${color.hex}, #000)`;
        }
      };
    }
  }, [currentSong, appContainerRef]);

  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.play().catch(error => {
        console.error('Error playing the audio:', error);
      });
      setIsPlaying(true);
    }
  }, [currentSong]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error('Error playing the audio:', error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (e) => {
    const seekTime = e.target.value;
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleCompactClick = (e) => {
    e.stopPropagation();
    setIsExpanded(true);
  };

  const handleControlClick = (e, action) => {
    e.stopPropagation();
    action();
  };

  const renderPlayerContent = () => (
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
          <span>{formatTime(duration)}</span>
        </div>
        <div className={styles.controls}>
          <div>
            <img src={dot} alt="dot" />
          </div>
          <div className={styles.icns}>
            <img src={pre} alt="Previous" className={styles.controlIcon} onClick={onPrevious} />
            {isPlaying ? (
              <img src={pause} alt="Pause" className={styles.controlIcon} onClick={handlePlayPause} />
            ) : (
              <img src={play} alt="Play" className={styles.controlIcon} onClick={handlePlayPause} />
            )}
            <img src={next} alt="Next" className={styles.controlIcon} onClick={onNext} />
          </div>
          <div>
            <img
              src={sound}
              alt="Sound"
              onClick={handleMute}
              className={styles.soundIcon}
            />
          </div>
        </div>
      </div>
    </>
  );

  if (!currentSong) {
    return (
      <div className={styles.playerContainer}>
        <p>Select a song to play</p>
      </div>
    );
  }

  return (
    <div className={`${styles.playerContainer} ${isSmallScreen && isExpanded ? styles.expanded : ''}`}>
      {isSmallScreen ? (
        isExpanded ? (
          <div className={styles.expandedPlayer}>
            <button className={styles.closeButton} onClick={() => setIsExpanded(false)}>×</button>
            {renderPlayerContent()}
          </div>
        ) : (
          <div className={styles.compactPlayer} onClick={handleCompactClick}>
            <div className={styles.compactInfo}>
              <div className={styles.songTitle}>{currentSong.name}</div>
              <div className={styles.songArtist}>{currentSong.artist}</div>
            </div>
            <div className={styles.compactControls}>
              <img src={pre} alt="Previous" onClick={(e) => handleControlClick(e, onPrevious)} />
              {isPlaying ? (
                <img src={pause} alt="Pause" onClick={(e) => handleControlClick(e, handlePlayPause)} />
              ) : (
                <img src={play} alt="Play" onClick={(e) => handleControlClick(e, handlePlayPause)} />
              )}
              <img src={next} alt="Next" onClick={(e) => handleControlClick(e, onNext)} />
            </div>
          </div>
        )
      ) : (
        renderPlayerContent()
      )}
      <audio ref={audioRef} src={currentSong.url} preload="auto" />
    </div>
  );
};

export default MusicPlayer;