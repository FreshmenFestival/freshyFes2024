import React, { useEffect, useState } from 'react';
import { UserData } from "../utils/constant";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';

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

const ComDashboard: React.FC<DashboardProps> = ({ userData }) => {
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

        const total = scoresData.reduce((acc, score) => acc + score.score, 0);

        const rankedScoresData = scoresData
          .sort((a, b) => b.score - a.score)
          .map((data, index) => ({
            ...data,
            rank: index + 1,
            percentage: total === 0 ? 0 : (data.score / total) * 100
          }));

        setScores(rankedScoresData);
      } catch (err) {
        console.error("Error fetching scores:", err);
      }
    };

    fetchScores();
  }, [userData.group]);

  const getGroupName = (groupId: string) => {
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

  const getColor = (getGroupName: string) => {
    switch(getGroupName) {
      case "MonoRabian":
        return "#ff7300"; 
      case "Edenity":
        return "#387908"; 
      case "Tartarus":
        return "#a4de6c"; 
      case "Avalon":
        return "#8a4d76"; 
      case "Lyford":
        return "#d0d0d0"; 
      case "Atlansix":
        return "#00c49f"; 
      case "Staff":
        return "#000000"; 
      default:
        return "#8884d8"; 
    }
  };

  const formattedScores = scores.map(score => ({
    ...score,
    group: getGroupName(score.group) 
  }));

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-pink-200">
      <h3 className="text-center text-2xl font-semibold mb-6">สรุปผล</h3>

      <BarChart width={1000} height={100} data={formattedScores} layout="vertical">

        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" />

        <XAxis 
          type="number" 
          tick={{ fill: '#ffffff' }} 
          stroke="#ffffff"
        />

        <YAxis type="category" 
          dataKey="group" 
          tick={{ fill: '#ffffff' }} 
          stroke="#ffffff"
        />

        <Tooltip 
          formatter={(value: number) => `${value.toFixed(2)}%`} 
          contentStyle={{ color: '#000000', borderColor: '#000000' }} 
        />

        <Legend/>

        <Bar dataKey="percentage">
          {formattedScores.map((score, index) => (
            <Cell key={`cell-${index}`} fill={getColor(score.group)} />
          ))}
        </Bar>

      </BarChart>
    </div>
  );
};

export default ComDashboard;



