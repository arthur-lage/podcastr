import { useContext, useEffect, useRef, useState } from 'react';
import { PlayerContext, PlayerContextProvider } from '../../contexts/PlayerContext';

import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

import Image from 'next/image'

import styles from './styles.module.scss';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

import Head from 'next/head';

export function Player(){

    const { episodeList, 
        currentEpisodeIndex, 
        isPlaying,
        hasNext,
        hasPrevious,
        isLooping,
        togglePlay,
        setPlayingState,
        toggleIsShuffling,
        isShuffling,
        playNext,
        toggleLoop,
        clearPlayerState,
        playPrevious,
    } = useContext(PlayerContext);

    const audioRef = useRef<HTMLAudioElement>(null);

    const episode = episodeList[currentEpisodeIndex];

    const [progress, setProgress] = useState(0)

    useEffect(() => {
        if(!audioRef.current){
            return;
        }
        
        if (isPlaying){
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }

    }, [isPlaying])

    function setupProgressListener(){
        audioRef.current.currentTime = 0;

        audioRef.current.addEventListener("timeupdate", () => {

            setProgress(Math.floor(audioRef.current.currentTime));
        })
    }

    function handleSeek(amount: number){
        audioRef.current.currentTime = amount;
        setProgress(amount);
    }

    function handleEpisodeEnded(){
        if(hasNext){
            playNext();
        } else {
            clearPlayerState();
        }
    }

    return(
        <div className={styles.playerContainer}>

            <Head>
                <title>{episode.title} | Podcastr</title>
            </Head>

            <header>
                <img src="/playing.svg" alt="Tocando Agora"/>
                <strong>Tocando agora</strong>
            </header>

            { episode ? (
                <div className={styles.currentEpisode}>
                    <Image 
                    src={episode.thumbnail}
                    width={592}
                    height={592}
                    objectFit="cover"
                    />
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ) : (
                <div>
                    <div className={styles.emptyPlayer}>
                        <strong>Selecione um podcast para ouvir</strong>
                    </div>
                </div>
            )}

            <footer className={!episode ? styles.empty : ''}>
                <div className={styles.progress}>
                    <span>{convertDurationToTimeString(progress)}</span>
                    <div className={styles.slider}>
                        { episode ? (
                            <Slider
                            max={episode.duration}
                            value={progress}
                            onChange={handleSeek}
                            trackStyle={{ backgroundColor: '#04d361'}} 
                            railStyle={{ backgroundColor: '#9f75ff'}}
                            handleStyle={{ borderColor: '#04d361', borderWidth: 4}} 
                            />
                        ) : (
                            <div className={styles.emptySlider} />
                        )}
                    </div>
                    <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
                </div>

                { episode && (
                    <audio 
                    ref={audioRef}
                    autoPlay
                    src={episode.url}
                    loop={isLooping}
                    onPlay={() => setPlayingState(true)}
                    onEnded={handleEpisodeEnded}
                    onPause={() => setPlayingState(false)}
                    onLoadedMetadata={setupProgressListener}
                />
                )}

                <div className={styles.buttons}>
                    <button type="button" onClick={toggleIsShuffling} className={isShuffling ? styles.isActive : ''} disabled={!episode }>
                        <img src="/shuffle.svg" alt="Embaralhar"/>
                    </button>
                    <button type="button" onClick={playPrevious} disabled={!episode || !hasPrevious}>
                        <img src="/play-previous.svg" alt="Tocar anterior"/>
                    </button>
                    <button type="button" onClick={togglePlay} disabled={!episode} className={styles.playButton}>
                        { isPlaying 
                         ? 
                            <img src="/pause.svg" alt="Pausar"/>
                         : 
                            <img src="/play.svg" alt="Tocar"/>
                        }
                    </button>
                    <button type="button" onClick={playNext} disabled={!episode || !hasNext}>
                        <img src="/play-next.svg" alt="Tocar próxima"/>
                    </button>
                    <button type="button"
                        onClick={toggleLoop} className={isLooping ? styles.isActive : ''} disabled={!episode}>
                        <img src="/repeat.svg" alt="Tocar novamente"/>
                    </button>
                </div>
            </footer>

        </div>
    )
}