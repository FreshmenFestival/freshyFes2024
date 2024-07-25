import React, { useEffect, useState } from 'react';
import { UserData } from "../utils/constant";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

interface DashboardProps {
  userData: UserData;
  onBack: () => void;
}

interface ScoreData {
  group: string;
  score: number;
}

interface RankedScoreData extends ScoreData {
  rank: number;
  percentage: number;
}

const Dashboard: React.FC<DashboardProps> = ({ onBack }) => {
  const [scores, setScores] = useState<RankedScoreData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const q = collection(db, "scores");
        const querySnapshot = await getDocs(q);
        const scoresData: ScoreData[] = querySnapshot.docs.map(doc => ({
          group: doc.data().group,
          score: doc.data().score,
        }));

        const allGroups = ["1", "2", "3", "4", "5", "6", "7"];
        const groupedScores = allGroups.map(groupId => {
          const groupScores = scoresData.filter(score => score.group === groupId);
          const totalScore = groupScores.reduce((acc, score) => acc + score.score, 0);
          return { group: groupId, score: totalScore };
        });

        const totalScoreSum = groupedScores.reduce((acc, score) => acc + score.score, 0);

        const scoresWithPercentage = groupedScores.map(scoreData => ({
          ...scoreData,
          percentage: totalScoreSum === 0 ? 0 : (scoreData.score / totalScoreSum) * 100
        }));

        const sortedScores = scoresWithPercentage.sort((a, b) => b.score - a.score);

        const rankedScores = sortedScores.map((scoreData, index) => ({
          ...scoreData,
          rank: index + 1
        }));

        setScores(rankedScores);
      } catch (err) {
        setError("Error fetching scores");
        console.error("Error fetching scores:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, []);

  const group = (groupId: string) => {
    switch(groupId) {
      case "1": return "MonoRabian";
      case "2": return "Edenity";
      case "3": return "Tartarus";
      case "4": return "Avalon";
      case "5": return "Lyford";
      case "6": return "Atlansix";
      case "7": return "Staff";
      default: return "Unknown Group";
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-phone font-prompt">

      <div className="bg-white p-8 rounded-lg shadow-md w-80 max-w-md font-noto-sans mt-20 text-amber-900">
        <div className="inline">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
          </svg>
          <h3 className="text-center text-2xl font-semibold mb-4">สรุปผล</h3>
        </div>
        

        <table className="w-full text-center mr-3">
          <thead>
            <tr>
              <th className="text-xs md:text-sm p-2 md:p-4">อันดับ</th>
              <th className="text-xs md:text-sm p-2 md:p-4">ชื่อกรุ๊ป</th>
              {/* <th className="text-xs md:text-sm p-2 md:p-4">คะแนน</th> */}
              <th className="text-xs md:text-sm p-2 md:p-4">เปอร์เซ็นต์</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((scoreData, index) => (
              <tr key={index} className="border-t">
                <td className="text-xs md:text-sm p-2 md:p-4">{scoreData.rank}</td>
                <td className="text-xs md:text-sm p-2 md:p-4">{group(scoreData.group)}</td>
                {/* <td className="text-xs md:text-sm p-2 md:p-4">{scoreData.score}</td> */}
                <td className="text-xs md:text-sm p-2 md:p-4">{scoreData.percentage.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="mt-4 px-6 py-2 bg-white-50 text-center text-sm text-amber-900 font-prompt font-semibold mb-6 
          rounded-lg focus:outline-none" onClick={onBack}>
            Back
      </button>

    </div>

  );
};

export default Dashboard;
