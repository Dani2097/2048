import { NextResponse } from 'next/server';
import { getTopScores, addScore, getScoreBySessionId } from '../../lib/db';

export async function GET() {
    try {
        // Fetch all scores
        const scores = await getTopScores();

        // Create a map to store the highest score for each unique playerName and sessionId combination
        const uniqueScores = {};

        scores.forEach(score => {
            const { player_name, session_id } = score;
            const key = `${player_name}-${session_id||0}`;
            console.log(score,key)


            if (!uniqueScores[key] || score.score > uniqueScores[key].score) {
                uniqueScores[key] = {
                    player_name,
                    sessionId: session_id || '0',  // Use '0' if sessionId is missing
                    score: score.score,
                };
            }
        });

        // Convert the uniqueScores object back to an array
        const uniqueScoresArray = Object.values(uniqueScores);

        return NextResponse.json(uniqueScoresArray);
    } catch (error) {
        console.error('Error fetching scores:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { playerName, score, sessionId } = await request.json();
        if (!playerName || typeof score !== 'number' || !sessionId) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }

        // Check if a score for this session already exists
        const existingScore = await getScoreBySessionId(sessionId);
        if (existingScore) {
            return NextResponse.json({ error: 'Score already saved for this session' }, { status: 409 });
        }

        await addScore(playerName, score, sessionId);
        return NextResponse.json({ message: 'Score added successfully' }, { status: 201 });
    } catch (error) {
        console.error('Error adding score:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}