'use client'
import Link from 'next/link';
import { useEffect, useState } from "react";
import { Gamepad} from 'lucide-react';

export default function Leaderboard() {
    const [scores, setScores] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const scores = await fetch('/api/scores').then(res => res.json());
            scores.sort((a, b) => b.score - a.score);
            setScores(scores);
        }
        fetchData();
    }, []);

    return (
        <div className="text-black min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-8">
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Leaderboard 2048</h1>
                <table className="w-full">
                    <thead>
                    <tr className="bg-gray-100">
                        <th className="px-4 py-2 text-left">#</th>
                        <th className="px-4 py-2 text-left">Player</th>
                        <th className="px-4 py-2 text-right">Point</th>
                    </tr>
                    </thead>
                    <tbody>
                    {scores.map((score, index) => (
                        <tr key={score.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                            <td className="px-4 py-2">{index + 1}</td>
                            <td className="px-4 py-2">{score.player_name}</td>
                            <td className="px-4 py-2 text-right">{score.score}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className="mt-8 text-center">
                    <Link href="/">
                        <button className="px-6 py-3 bg-blue-500 text-white rounded-full text-xl font-bold shadow-lg hover:bg-blue-600 transition duration-300">
                            <Gamepad className="inline-block mr-2" />
                            Back to game
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}