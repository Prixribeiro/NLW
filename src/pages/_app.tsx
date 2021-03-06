import Header from '../components/Header';
import '../styles/global.scss';
import styles from '../styles/app.module.scss';
import Player from '../components/Player';
import { PlayerContext } from '../contexts/PlayerContext';
import { useState } from 'react';

function MyApp({ Component, pageProps }) {

  const [episodeList, setEpisodeList] = useState([]);
  const [currenteEpisodeIndex, setCurrenteEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  function play(episode){
    setEpisodeList([episode]);
    setCurrenteEpisodeIndex(0);
    setIsPlaying(true);
  }

  function togglePlay(){
    setIsPlaying(!isPlaying);

  }

  function setPlayingState(state:boolean){
    setIsPlaying(state);
  }

  return (
    <PlayerContext.Provider value={{ episodeList, currenteEpisodeIndex, play, isPlaying, togglePlay, setPlayingState}}>
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>  
    </PlayerContext.Provider>
  )
}

export default MyApp
