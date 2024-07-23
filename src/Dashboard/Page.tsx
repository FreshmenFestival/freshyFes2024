import React, { useEffect, useState } from 'react';
import { UserData } from "../utils/constant";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

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

const Dashboard: React.FC<DashboardProps> = ({ userData, onBack }) => {
  const [scores, setScores] = useState<RankedScoreData[]>([]);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const q = query(
          collection(db, "scores"),
          where("group", "==", userData.group)
        );
        const querySnapshot = await getDocs(q);
        const scoresData: ScoreData[] = querySnapshot.docs.map(doc => ({
          group: doc.data().group,
          score: doc.data().score,
        }));

        if (scoresData.length === 0) {
          setScores([]);
          return;
        }

        // Calculate the total score for all groups
        const total = scoresData.reduce((acc, score) => acc + score.score, 0);

        // Sort the scores in descending order and add rank and percentage
        const rankedScoresData = scoresData
          .sort((a, b) => b.score - a.score)
          .map((data, index) => ({
            ...data,
            rank: index + 1,
            percentage: total === 0 ? 0 : (data.score / total) * 100 // Handle division by zero
          }));

        setScores(rankedScoresData);
      } catch (err) {
        console.error("Error fetching scores:", err);
      }
    };

    fetchScores();
  }, [userData.group]);

  const group = (groupId: string) => {
    switch(groupId) {
      case "1":
        return "MonoRabian";
      case "2":
        return "Edenity";
      case "3":
        return "Tartarus";
      case "4":
        return "Avalon";
      case "5":
        return "Lyford";
      case "6":
        return "Atlansix";
      case "7":
        return "Staff";
      default:
        return "Unknown Group";
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-phone font-prompt">
      <div className="absolute top-10 right-10 m-4 text-xs text-white">
        {userData.name}
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md w-80 max-w-md font-noto-sans mt-20">
        <h3 className="text-center text-2xl font-semibold mb-4">สรุปผล</h3>

        <table className="w-full text-center">
          <thead>
            <tr>
              <th className="text-xs md:text-sm p-2 md:p-4">อันดับ</th>
              <th className="text-xs md:text-sm p-2 md:p-4">ชื่อกรุ๊ป</th>
              <th className="text-xs md:text-sm p-2 md:p-4">เปอร์เซ็นต์</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((scoreData, index) => (
              <tr key={index} className="border-t">
                <td className="text-xs md:text-sm p-2 md:p-4">{scoreData.rank}</td>
                <td className="text-xs md:text-sm p-2 md:p-4">{group(scoreData.group)}</td>
                <td className="text-xs md:text-sm p-2 md:p-4">{scoreData.percentage.toFixed(0)}%</td>
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


