import { useEffect, useState } from 'react';
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, Cell } from 'recharts';

interface ScoreData {
  group: string;
  score: number;
}

interface RankedScoreData extends ScoreData {
  rank: number;
  percentage: number;
}

const ComDashboard = () => {
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
      case "1": return "Monorabian";
      case "2": return "Edenity";
      case "3": return "Tartarus";
      case "4": return "Avalon";
      case "5": return "Lyford";
      case "6": return "Atlansix";
      case "7": return "Staff";
      default: return "Unknown Group";
    }
  };

  const getColor = (groupName: string) => {
    switch(groupName) {
      case "Monorabian": return "#F57B2D"; 
      case "Edenity": return "#056100"; 
      case "Tartarus": return "#7429A5"; 
      case "Avalon": return "#FF9ECA"; 
      case "Lyford": return "#E8AB29"; 
      case "Atlansix": return "#3B61C8"; 
      case "Staff": return "#C6C6C6"; 
      default: return "#8884d8"; 
    }
  };

  const getImageUrl = (groupName: string) => {
    switch(groupName) {
      case "Monorabian": return "/G1.png"; 
      case "Edenity": return "/G2.png"; 
      case "Tartarus": return "/G3.png"; 
      case "Avalon": return "/G4.png"; 
      case "Lyford": return "/G5.png"; 
      case "Atlansix": return "/G6.png"; 
      case "Staff": return "/logo.png"; 
      default: return ''; 
    }
  };

  const formattedScores = scores.map(score => ({
    ...score,
    group: getGroupName(score.group) 
  }));

  const renderCustomBarLabel = (props: any) => {
    const { x, y, width, height, index } = props;
    const group = formattedScores[index].group;
    const imageUrl = getImageUrl(group);
    const percentage = formattedScores[index].percentage.toFixed(2);

    if (loading) {
      return <div className="flex justify-center items-center min-h-screen bg-PC bg-contain">
        <img className="animate-spin h-18 w-18" src="/progress_amber.png"></img>
      </div>;
    }
  
    if (error) {
      return <div>{error}</div>;
    }

    return (
      <g>
        <defs>
          <clipPath id={`clip-circle-${index}`}>
            <circle cx={x + width + 25} cy={y + height / 2} r={20} />
          </clipPath>
        </defs>

        <image 
          x={x + width - 1} 
          y={y + height / 2 - 26} 
          width="52" 
          height="52" 
          href={imageUrl} 
          clipPath={`url(#clip-circle-${index})`}
        />

        <text 
          x={x + width + 50} 
          y={y + height / 2 + 5} 
          fill="#78350F" 
          fontSize="20px"
          fontFamily="Alice, sans-serif"
          textAnchor="start"
        >
          {percentage}%
        </text>
      </g>
    );
  };

  return (
    <div className="flex flex-col justify-center items-center max-w-screen min-h-screen bg-PC">
      <h3 className="text-center text-4xl text-amber-900 font-great mt-6"><b>Scores</b></h3>

      <BarChart width={800} height={500} data={formattedScores} layout="vertical" barCategoryGap="20%">
        <CartesianGrid strokeDasharray="3 3" stroke="#C6C6C6" />

        <XAxis 
          type="number"
          domain={[0, 100]} 
          tick={{ fill: '#78350F', fontSize: '12px', fontFamily: "Alice, sans-serif"  }} 
          stroke="#78350F"
        />

        <YAxis 
          type="category" 
          dataKey="group" 
          tick={{ fill: '#78350F', fontSize: '10px', fontFamily: "Alice, sans-serif"  }} 
          stroke="#78350F"
        />

        {/* <Tooltip 
          formatter={(value: number) => `${value.toFixed(2)}%`}
          contentStyle={{ color: '#78350F',backgroundColor: '#ffffff' , borderColor: '#78350F', fontFamily: "Alice, sans-serif" }}
          cursor={{ fill: 'rgba(0, 0, 0, 0)' }} 
        /> */}

        <Legend/>

        <Bar dataKey="percentage" label={renderCustomBarLabel}>
          {formattedScores.map((score, index) => (
            <Cell key={`cell-${index}`} fill={getColor(score.group)} />
          ))}
        </Bar>

      </BarChart>
      {error && <p>{error}</p>}
    </div>
  );
};

export default ComDashboard;