import Image from 'next/image';
import { useContext, useRef, useEffect } from 'react';
import { PlayerContext} from '../../contexts/PlayerContext';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import styles from './styles.module.scss';

export default function Player (){
    const audioRef = useRef<HTMLAudioElement>(null)

    const { episodeList, currenteEpisodeIndex, isPlaying, togglePlay, setPlayingState } = useContext(PlayerContext)

    useEffect(()=>{
        if(!audioRef.current){
            return;
        }

        if(isPlaying){
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying])

    const episode = episodeList[currenteEpisodeIndex]
    
    return (
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="Tocando agora"/>
                <strong>Tocando agora </strong>
            </header>
            
            {episode ? (
                <div className={styles.currentPlaying}>
                    <Image 
                        width={480} 
                        height={480} 
                        src={episode.thumbnail} 
                        objectFit='fill'
                    />
                <strong>{episode.title}</strong>
                <span>{episode.members}</span>
                </div>
            ):(
                <div className={styles.emptyPlayer}>
                    <strong>Selecione um podcast para ouvir</strong>
                </div>
            )}

            

            <footer className={!episode ? styles.empty: ''}>
                <div className={styles.progress}>
                    <span>00:00</span>
                    <div className={styles.slider}>
                        {episode ? (
                            <Slider 
                                trackStyle={{backgroundColor: '#04d361'}}
                                railStyle={{backgroundColor: '#9f75ff'}}
                                handleStyle={{borderColor: '#04d361', borderWidth: 3}}
                            />
                        ):(
                            <div className={styles.emptySlider} />
                        )}
                    </div>
                    <span>00:00</span>
                </div>
                
                {episode && 
                    (<audio  
                    src={episode.url} 
                    ref={audioRef}
                    autoPlay
                    onPlay={() => setPlayingState(true)}
                    onPause={() => setPlayingState(false)}
                    />
                )}
                

                <div className={styles.buttons}>
                    <button type="button" disabled={!episode}>
                        <img src="/shuffle.svg" alt="Ativar modo aleatório" />
                    </button>
                    <button type="button" disabled={!episode}>
                        <img src="/play-previous.svg" alt="Ouvir podcast anterior" />
                    </button>
                    <button type="button" className={styles.playButton} disabled={!episode} onClick={togglePlay}>
                        {isPlaying 
                            ? <img src="/pause.svg" alt="pausar podcast" />   
                            : <img src="/play.svg" alt="Ouvir podcast" /> 
                        }
                    </button>
                    <button type="button" disabled={!episode}>
                        <img src="/play-next.svg" alt="Ouvir próximo podcast" />
                    </button>
                    <button type="button" disabled={!episode}>
                        <img src="/repeat.svg" alt="Repetir podcast" />
                    </button>
                </div>
            </footer>

        </div>
    );
}