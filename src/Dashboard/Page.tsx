import React, { useEffect, useState } from 'react';
import { UserData } from "../utils/constant";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

interface DashboardProps {
  userData: UserData;
}

interface ScoreData {
  group: string;
  score: number;
}

interface RankedScoreData extends ScoreData {
  rank: number;
  percentage: number;
}

const Dashboard: React.FC<DashboardProps> = ({ userData }) => {
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
    <div className="flex flex-col justify-center items-center min-h-screen bg-pink-200">
      <div className="absolute top-10 right-20 m-4 text-sm font-noto-sans text-white">
        {userData.name}
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md w-80 font-noto-sans">
        <h3 className="text-center text-2xl font-semibold mb-6">สรุปผล</h3>

        <div className="flex flex-row">
          <div className="w-1/3 text-sm p-4">อันดับ</div>
          <div className="w-1/3 text-sm p-4">ชื่อกรุ๊ป</div>
          <div className="w-1/3 text-sm p-4">เปอร์เซ็นต์</div>
        </div>

        {scores.map((scoreData, index) => (
          <div className="flex flex-row" key={index}>
            <div className="w-1/3 text-sm p-4">{scoreData.rank}</div>
            <div className="w-1/3 text-sm p-4">{group(scoreData.group)}</div>
            <div className="w-1/3 text-sm p-4">{scoreData.percentage.toFixed(0)}%</div>
          </div>
        ))}
      </div>

      <button
        className="mt-4 px-6 py-2 bg-white text-center text-sm font-semibold mb-6 rounded-lg focus:outline-none"
      >
        Back
      </button>

      <div className="text-white text-xs underline p-4">ออกจากระบบ</div>
    </div>
  );
};

export default Dashboard;


