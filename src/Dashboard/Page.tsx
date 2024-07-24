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

      <div className="bg-white p-8 rounded-lg shadow-md w-80 max-w-md font-noto-sans mt-20">
        <h3 className="text-center text-2xl font-semibold mb-4">สรุปผล</h3>

        <table className="w-full text-center">
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

      <button className="mt-4 px-6 py-2 bg-white text-center text-sm  font-prompt font-semibold mb-6 
        rounded-lg focus:outline-none" onClick={onBack}>
          Back
      </button>

    </div>

  );
};

export default Dashboard;
