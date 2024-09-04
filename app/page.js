'use client'
import React, {useState, useEffect} from 'react';
import {useSwipeable} from 'react-swipeable';
import {motion, AnimatePresence} from 'framer-motion';
import {Trophy, RotateCcw} from 'lucide-react';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';
import Head from "next/head";
const Gioco2048 = () => {
    const [griglia, setGriglia] = useState([]);
    const [punteggio, setPunteggio] = useState(0);
    const [bestScore, setBestScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [playerName, setPlayerName] = useState('');
    const [sessionId, setSessionId] = useState('');
    const [saveFeedback, setSaveFeedback] = useState('');
    useEffect(() => {
        inizializzaGioco();
        const savedBestScore = localStorage.getItem('bestScore');
        if (savedBestScore) setBestScore(parseInt(savedBestScore));
    }, []);

    useEffect(() => {
        if (punteggio > bestScore) {
            setBestScore(punteggio);
            localStorage.setItem('bestScore', punteggio.toString());
        }
    }, [punteggio, bestScore]);


    const inizializzaGioco = () => {
        let nuovaGriglia = Array(4).fill().map(() => Array(4).fill(0));
        nuovaGriglia = aggiungiNumero(nuovaGriglia);
        nuovaGriglia = aggiungiNumero(nuovaGriglia);
        setGriglia(nuovaGriglia);
        setPunteggio(0);
        setGameOver(false);
        setSessionId(uuidv4());
        setSaveFeedback('');
    };
    const aggiungiNumero = (grid) => {
        let opzioni = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (grid[i][j] === 0) {
                    opzioni.push({i, j});
                }
            }
        }
        if (opzioni.length > 0) {
            const {i, j} = opzioni[Math.floor(Math.random() * opzioni.length)];
            grid[i][j] = Math.random() < 0.9 ? 2 : 4;
        }
        return grid;
    };

    const muovi = (direzione) => {
        if (gameOver) return;

        let nuovaGriglia = JSON.parse(JSON.stringify(griglia));
        let punteggioTurno = 0;
        let mosso = false;

        const ruota = (grid) => grid[0].map((_, i) => grid.map(row => row[i]).reverse());

        if (direzione === 'destra') {
            nuovaGriglia = nuovaGriglia.map(row => {
                const [newRow, score] = scorriRiga(row.reverse());
                punteggioTurno += score;
                mosso = mosso || JSON.stringify(newRow) !== JSON.stringify(row);
                return newRow.reverse();
            });
        } else if (direzione === 'sinistra') {
            nuovaGriglia = nuovaGriglia.map(row => {
                const [newRow, score] = scorriRiga(row);
                punteggioTurno += score;
                mosso = mosso || JSON.stringify(newRow) !== JSON.stringify(row);
                return newRow;
            });
        } else if (direzione === 'su') {
            nuovaGriglia = ruota(nuovaGriglia);
            nuovaGriglia = nuovaGriglia.map(row => {
                const [newRow, score] = scorriRiga(row);
                punteggioTurno += score;
                mosso = mosso || JSON.stringify(newRow) !== JSON.stringify(row);
                return newRow;
            });
            nuovaGriglia = ruota(ruota(ruota(nuovaGriglia)));
        } else if (direzione === 'giu') {
            nuovaGriglia = ruota(nuovaGriglia);
            nuovaGriglia = nuovaGriglia.map(row => {
                const [newRow, score] = scorriRiga(row.reverse());
                punteggioTurno += score;
                mosso = mosso || JSON.stringify(newRow) !== JSON.stringify(row);
                return newRow.reverse();
            });
            nuovaGriglia = ruota(ruota(ruota(nuovaGriglia)));
        }

        if (mosso) {
            nuovaGriglia = aggiungiNumero(nuovaGriglia);
            setGriglia(nuovaGriglia);
            setPunteggio(punteggio + punteggioTurno);
        }

        if (!mosseDisponibili(nuovaGriglia)) {
            setGameOver(true);
        }
    };

    const scorriRiga = (row) => {
        let newRow = row.filter(cell => cell !== 0);
        let score = 0;
        for (let i = 0; i < newRow.length - 1; i++) {
            if (newRow[i] === newRow[i + 1]) {
                newRow[i] *= 2;
                score += newRow[i];
                newRow.splice(i + 1, 1);
            }
        }
        while (newRow.length < 4) {
            newRow.push(0);
        }
        return [newRow, score];
    };

    const mosseDisponibili = (grid) => {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (grid[i][j] === 0) return true;
                if (i < 3 && grid[i][j] === grid[i + 1][j]) return true;
                if (j < 3 && grid[i][j] === grid[i][j + 1]) return true;
            }
        }
        return false;
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight') muovi('destra');
            else if (e.key === 'ArrowLeft') muovi('sinistra');
            else if (e.key === 'ArrowUp') muovi('su');
            else if (e.key === 'ArrowDown') muovi('giu');
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [griglia, gameOver]);

    const handlers = useSwipeable({
        onSwipedLeft: () => muovi('sinistra'),
        onSwipedRight: () => muovi('destra'),
        onSwipedDown: () => muovi('su'),
        onSwipedUp: () => muovi('giu'),
        preventDefaultTouchmoveEvent: true,
        trackMouse: true
    });

    const coloreCella = (valore) => {
        switch (valore) {
            case 2:
                return 'bg-gradient-to-br from-yellow-200 to-yellow-300';
            case 4:
                return 'bg-gradient-to-br from-yellow-300 to-yellow-400';
            case 8:
                return 'bg-gradient-to-br from-orange-300 to-orange-400';
            case 16:
                return 'bg-gradient-to-br from-orange-400 to-orange-500';
            case 32:
                return 'bg-gradient-to-br from-red-400 to-red-500';
            case 64:
                return 'bg-gradient-to-br from-red-500 to-red-600';
            case 128:
                return 'bg-gradient-to-br from-blue-400 to-blue-500';
            case 256:
                return 'bg-gradient-to-br from-blue-500 to-blue-600';
            case 512:
                return 'bg-gradient-to-br from-indigo-400 to-indigo-500';
            case 1024:
                return 'bg-gradient-to-br from-indigo-500 to-indigo-600';
            case 2048:
                return 'bg-gradient-to-br from-purple-500 to-purple-600';
            case 4096:
                return 'bg-gradient-to-br from-pink-500 to-pink-600';
            case 8192:
                return 'bg-gradient-to-br from-purple-600 to-purple-700';
            default:
                return 'bg-gray-200';
        }
    };

    const fontSizeCella = (valore) => {
        if (valore < 100) return 'text-4xl';
        if (valore < 1000) return 'text-3xl';
        return 'text-2xl';
    };
    const salvaScoreSulServer = async () => {
        if (playerName) {
            try {
                const response = await fetch('/api/scores', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ playerName, score: punteggio, sessionId }),
                });
                if (response.ok) {
                    document.getElementById('new-game-button').click();
                    setSaveFeedback('Punteggio salvato con successo!');
                } else {
                    const errorData = await response.json();
                    setSaveFeedback(`Errore nel salvataggio del punteggio: ${errorData.error}`);
                }
            } catch (error) {
                setSaveFeedback(`Errore nella richiesta: ${error.message}`);
            }
        }
    };
    useEffect(() => {
        if (gameOver) {
            salvaScoreSulServer();
        }
    }, [gameOver]);
    return (
        <div
            className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-1">
            <Head>

                <meta name="keywords" content="2048, gioco, numeri, puzzle, sfida, divertimento" />
                <meta name="author" content="Your Name" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="canonical" href="https://yourwebsite.com/gioco2048" />

                {/* Open Graph Meta Tags */}
                <meta property="og:title" content="Gioco 2048 - Divertiti e sfida i tuoi amici!" />
                <meta
                    property="og:description"
                    content="Gioca a 2048, il famoso gioco di combinazione di numeri. Muovi le tessere, somma i numeri e raggiungi il numero 2048 per vincere!"
                />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://yourwebsite.com/gioco2048" />
                <meta property="og:image" content="https://yourwebsite.com/path-to-image.jpg" />

                {/* Twitter Card Meta Tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Gioco 2048 - Divertiti e sfida i tuoi amici!" />
                <meta
                    name="twitter:description"
                    content="Gioca a 2048, il famoso gioco di combinazione di numeri. Muovi le tessere, somma i numeri e raggiungi il numero 2048 per vincere!"
                />
                <meta name="twitter:image" content="https://yourwebsite.com/path-to-image.jpg" />
            </Head>
            {gameOver && (
                <motion.div
                    initial={{opacity: 0, y: 50}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5}}
                    className="mt-8 text-white text-center"
                >
                    <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
                    <input
                        type="text"
                        placeholder="Il tuo nome"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        className="px-4 py-2 rounded-lg text-gray-800 mb-4"
                    />
                    <button
                        onClick={salvaScoreSulServer}
                        className="px-6 py-2 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition duration-300"
                    >
                        Save Score
                    </button>
                    {saveFeedback && (
                        <p className="mt-2 text-sm text-white">{saveFeedback}</p>
                    )}
                </motion.div>
            )}
            <motion.h1
                initial={{y: -50, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                transition={{type: "spring", stiffness: 300, damping: 20}}
                className="text-6xl font-bold mb-6 text-white text-shadow-lg"
            >
                2048
            </motion.h1>
            <div className="flex justify-between w-full max-w-md mb-4">
                <motion.div
                    initial={{x: -50, opacity: 0}}
                    animate={{x: 0, opacity: 1}}
                    className="text-white text-xl"
                >
                    Score: {punteggio}
                </motion.div>
                <motion.div
                    initial={{x: 50, opacity: 0}}
                    animate={{x: 0, opacity: 1}}
                    className="text-white text-xl"
                >
                    Record: {bestScore}
                </motion.div>
            </div>
            <motion.div
                {...handlers}
                className="grid grid-cols-4 gap-2 bg-white bg-opacity-20 p-4 rounded-xl shadow-lg"
                initial={{scale: 0.8, opacity: 0}}
                animate={{scale: 1, opacity: 1}}
                transition={{type: "spring", stiffness: 300, damping: 20}}
            >
                <AnimatePresence>
                    {griglia.map((riga, i) =>
                        riga.map((cella, j) => (
                            <motion.div
                                key={`${i}-${j}`}
                                initial={{scale: 0}}
                                animate={{scale: 1}}
                                exit={{scale: 0}}
                                transition={{type: "spring", stiffness: 300, damping: 20}}
                                className={`w-20 h-20 flex items-center justify-center ${fontSizeCella(cella)} font-bold text-gray-800 rounded-lg shadow-md ${coloreCella(cella)}`}
                            >
                                {cella !== 0 && cella}
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </motion.div>
            {gameOver && (
                <motion.div
                    initial={{opacity: 0, y: 50}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5}}
                    className="mt-8 text-3xl font-bold text-white text-shadow-lg"
                >
                    Game Over!
                </motion.div>
            )}
            <div className="mt-4 flex flex-col md:flex-row space-y-4 md:space-x-4">
                <motion.button
                    whileHover={{scale: 1.1}}
                    id={"new-game-button"}
                    whileTap={{scale: 0.9}}
                    onClick={inizializzaGioco}
                    className="px-6 py-3 bg-white text-purple-600 rounded-full text-xl font-bold shadow-lg hover:bg-opacity-90 transition duration-300"
                >
                    <RotateCcw className="inline-block mr-2"/>
                    New Game
                </motion.button>
                <Link href="/leaderboard">
                    <motion.button
                        whileHover={{scale: 1.1}}
                        whileTap={{scale: 0.9}}
                        className="px-6 py-3 bg-white text-purple-600 rounded-full text-xl font-bold shadow-lg hover:bg-opacity-90 transition duration-300"
                    >
                        <Trophy className="inline-block mr-2"/>
                        Leaderboard
                    </motion.button>
                </Link>
            </div>
        </div>
    );
};

export default Gioco2048;