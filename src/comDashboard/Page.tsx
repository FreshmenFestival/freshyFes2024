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

  const getGroupName = (groupId: string) => {
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

  const getColor = (getGroupName: string) => {
    switch(getGroupName) {
      case "MonoRabian": return "#F57B2D"; 
      case "Edenity": return "#056100"; 
      case "Tartarus": return "#7429A5"; 
      case "Avalon": return "#FF9ECA"; 
      case "Lyford": return "#E8AB29"; 
      case "Atlansix": return "#3B61C8"; 
      case "Staff": return "#C6C6C6"; 
      default: return "#8884d8"; 
    }
  };

  const formattedScores = scores.map(score => ({
    ...score,
    group: getGroupName(score.group) 
  }));

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-PC">
      <h3 className="text-center text-4xl font-great mb-6"><b>Scores</b></h3>

      <BarChart width={800} height={300} data={formattedScores} layout="vertical">

        <CartesianGrid strokeDasharray="3 3" stroke="#C6C6C6" />

        <XAxis 
          type="number" 
          tick={{ fill: '#000000', fontSize: '12px'  }} 
          stroke="#000000"
        />

        <YAxis type="category" 
          dataKey="group" 
          tick={{ fill: '#000000', fontSize: '10px'  }} 
          stroke="#000000"
        />

        <Tooltip 
          formatter={(value: number) => `${value.toFixed(2)}%`} 
          contentStyle={{ color: '#000000', borderColor: '#000000' }} 
        />

        <Legend/>

        <Bar dataKey="percentage">
          {formattedScores.map((score, index) => (
            <Cell key={`cell-${index}`} fill={getColor(score.group)}/>
          ))}
        </Bar>

      </BarChart>
    </div>
  );
};

export default ComDashboard;



