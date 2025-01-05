import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

// Custom components
import ProgressBar from "./ProgressBar";  // A reusable ProgressBar component

const achievementsList = [
  {
    id: 1,
    name: "Checked Weather 7 Days in a Row",
    description: "Check the weather every day for 7 days.",
    target: 7,
    progressKey: "weatherCheckStreak",
    milestone: "Streak 7 Days",
  },
  {
    id: 2,
    name: "Logged 3 Cities",
    description: "Log weather data for 3 different cities.",
    target: 3,
    progressKey: "loggedCities",
  },
  {
    id: 3,
    name: "Shared the App",
    description: "Share the app with a friend.",
    target: 1,
    progressKey: "sharedApp",
  },
  {
    id: 4,
    name: "Check Weather for 30 Days",
    description: "Check the weather every day for 30 days.",
    target: 30,
    progressKey: "weatherCheck30Days",
    milestone: "Streak 30 Days",
  },
];

const Achievements = () => {
  const [completedAchievements, setCompletedAchievements] = useState([]);
  const [userProgress, setUserProgress] = useState({
    weatherCheckStreak: 0,
    loggedCities: 0,
    sharedApp: 0,
    weatherCheck30Days: 0,
  });
  const [dailyStreak, setDailyStreak] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");

  useEffect(() => {
    const savedAchievements = JSON.parse(localStorage.getItem("achievements")) || [];
    setCompletedAchievements(savedAchievements);
    
    const savedProgress = JSON.parse(localStorage.getItem("userProgress")) || userProgress;
    setUserProgress(savedProgress);

    const savedStreak = localStorage.getItem("dailyStreak") || 0;
    setDailyStreak(parseInt(savedStreak));

    const savedLeaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    setLeaderboard(savedLeaderboard);
  }, []);

  useEffect(() => {
    localStorage.setItem("achievements", JSON.stringify(completedAchievements));
    localStorage.setItem("userProgress", JSON.stringify(userProgress));
    localStorage.setItem("dailyStreak", dailyStreak);
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  }, [completedAchievements, userProgress, dailyStreak, leaderboard]);

  const handleAchievementCompletion = (achievementId, progressKey, milestone) => {
    if (!completedAchievements.includes(achievementId)) {
      const newAchievements = [...completedAchievements, achievementId];
      setCompletedAchievements(newAchievements);
      toast.success("Achievement Unlocked!");
    }

    const newProgress = { ...userProgress, [progressKey]: userProgress[progressKey] + 1 };
    setUserProgress(newProgress);

    if (milestone && newProgress[progressKey] === 7) {
      toast.info(`Milestone Unlocked: ${milestone}!`);
    }

    if (progressKey === "weatherCheckStreak") {
      const newStreak = dailyStreak + 1;
      setDailyStreak(newStreak);
    }

    const updatedLeaderboard = [...leaderboard, { username: "User", achievements: newAchievements }];
    setLeaderboard(updatedLeaderboard);
  };

  const renderProgressBar = (progress, target) => {
    return <ProgressBar progress={progress} target={target} />;
  };

  const toggleModal = (content) => {
    setModalContent(content);
    setShowModal(!showModal);
  };

  return (
    <div className="achievements bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-xl mx-auto mt-8 transition duration-500">
      <h2 className="text-3xl font-semibold mb-4 text-center text-gray-800 dark:text-white">Achievements</h2>

      <div className="achievement-list space-y-4">
        {achievementsList.map((achievement) => (
          <div
            key={achievement.id}
            className={`p-4 border rounded-lg ${completedAchievements.includes(achievement.id) ? "bg-green-100" : "bg-white dark:bg-gray-700"} hover:shadow-md transition`}
          >
            <p className="text-xl font-medium">{achievement.name}</p>
            <p>{achievement.description}</p>

            {renderProgressBar(userProgress[achievement.progressKey], achievement.target)}

            <button
              onClick={() =>
                handleAchievementCompletion(achievement.id, achievement.progressKey, achievement.milestone)
              }
              className={`mt-2 px-6 py-2 text-white rounded-lg transition ease-in-out ${
                completedAchievements.includes(achievement.id) ? "bg-green-500" : "bg-blue-500 hover:bg-blue-700"
              }`}
            >
              {completedAchievements.includes(achievement.id) ? "Achieved" : "Complete"}
            </button>

            <div className="mt-2 text-sm">
              <span
                onClick={() => toggleModal(achievement.description)}
                className="cursor-pointer text-blue-600 hover:underline"
              >
                More Info
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Leaderboard Section */}
      <div className="mt-8">
        <h3 className="text-2xl font-semibold text-center text-gray-800 dark:text-white">Leaderboard</h3>
        <div className="leaderboard mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {leaderboard.map((entry, index) => (
            <div key={index} className="leaderboard-entry bg-white dark:bg-gray-700 p-4 border rounded-lg shadow-md hover:scale-105 transition">
              <p className="font-medium">{entry.username}</p>
              <p className="text-sm text-gray-600">Achievements: {entry.achievements.length}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Streak */}
      <div className="mt-8">
        <h3 className="text-2xl font-semibold text-center text-gray-800 dark:text-white">Daily Streak</h3>
        <p className="text-center text-lg text-gray-700 dark:text-gray-300">Current Streak: {dailyStreak} days</p>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-sm w-full">
            <h4 className="text-xl font-semibold text-gray-800 dark:text-white">Achievement Details</h4>
            <p className="text-gray-600 dark:text-gray-300">{modalContent}</p>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 bg-red-500 text-white py-2 px-6 rounded-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Achievements;
