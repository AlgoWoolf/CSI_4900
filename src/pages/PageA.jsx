import React, { useState, useEffect } from "react";
import Flashcard from "../components/Flashcard.jsx";
import "../css/PageA.css";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import Quiz from "../components/Quiz.jsx";

// Helper functions to create pie chart arcs
function polarToCartesian(cx, cy, radius, angleInDegrees) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: cx + radius * Math.cos(angleInRadians),
    y: cy + radius * Math.sin(angleInRadians)
  };
}

function describeArc(cx, cy, radius, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y} L ${cx} ${cy} Z`;
}

// PieChart component for age distribution visualization
const PieChart = () => {
  // Provided age distribution data
  const pieData = [
    { label: "Minors (<18)", value: 46, color: "#FF6384" },
    { label: "Age 18-19", value: 28, color: "#36A2EB" },
    { label: "Age 20-22", value: 6, color: "#FFCE56" },
    { label: "Age 23-25", value: 6, color: "#4BC0C0" }
  ];
  const total = pieData.reduce((acc, cur) => acc + cur.value, 0);
  let cumulativeValue = 0;
  
  return (
    <svg width="200" height="200" viewBox="0 0 120 120">
      {pieData.map((slice, index) => {
        const startAngle = (cumulativeValue / total) * 360;
        cumulativeValue += slice.value;
        const endAngle = (cumulativeValue / total) * 360;
        const pathData = describeArc(60, 60, 50, startAngle, endAngle);
        return (
          <path key={index} d={pathData} fill={slice.color}>
            <title>{slice.label}: {slice.value}%</title>
          </path>
        );
      })}
    </svg>
  );
};

function PageA() {
  const [showPreQuiz, setShowPreQuiz] = useState(true);
  const [showPostQuiz, setShowPostQuiz] = useState(false);
  const [userName, setUserName] = useState("user-123");
  const [flashcardStudyStart, setFlashcardStudyStart] = useState(null);

  // When the pre-quiz is completed, start the flashcard study timer.
  useEffect(() => {
    if (!showPreQuiz && flashcardStudyStart === null) {
      setFlashcardStudyStart(Date.now());
    }
  }, [showPreQuiz, flashcardStudyStart]);

  // Pre-quiz questions with "Enter your name:" restored.
  const preQuizQuestions = [
    {
      id: "q1",
      type: "text",
      question: "Enter your name:"
    },
    {
      id: "q2",
      type: "multipleChoice",
      question: "Which term refers to the consensual sharing of sexual images via digital media, often within relationships?",
      options: [
        "Revenge porn",
        "Cyberstalking",
        "Sexting",
        "Sextortion"
      ],
      correctAnswer: "Sexting"
    },
    {
      id: "q3",
      type: "multipleChoice",
      question: "Which of the following best describes the term “sextortion”?",
      options: [
        "Sending sexually explicit messages",
        "Coercing someone into sending sexual content through the threat of exposing private images",
        "Posting personal information online",
        "Hacking into social media accounts"
      ],
      correctAnswer: "Coercing someone into sending sexual content through the threat of exposing private images"
    },
    {
      id: "q4",
      type: "multipleChoice",
      question: "What is a potential long-term consequence for adolescents victimized by dating violence and sextortion?",
      options: [
        "Higher income levels",
        "Lower likelihood of drug use",
        "Increased mental health and behavioral problems",
        "Better academic performance"
      ],
      correctAnswer: "Increased mental health and behavioral problems"
    },
    {
      id: "q5",
      type: "multipleChoice",
      question: "Which of the following is not always a motive behind sextortion?",
      options: [
        "Money",
        "Control in a romantic relationship",
        "Power and dominance",
        "Seeking therapy for trauma"
      ],
      correctAnswer: "Seeking therapy for trauma"
    },
    {
      id: "q6",
      type: "multipleChoice",
      question: "Which group reported higher rates of experiencing sexual cyber dating abuse?",
      options: [
        "Boys",
        "Girls",
        "Teachers",
        "College students"
      ],
      correctAnswer: "Girls"
    }
  ];

  // Post-quiz questions updated with the new content.
  const postQuizQuestions = [
    {
      id: "q1",
      type: "multipleChoice",
      question: "What age group represented the majority of cyber sextortion victims in the large survey of 1,631 individuals?",
      options: [
        "20–22 years old",
        "18–19 years old",
        "Under 18 years old",
        "23–25 years old"
      ],
      correctAnswer: "Under 18 years old"
    },
    {
      id: "q2",
      type: "multipleChoice",
      question: "Which group were victims most likely to report as their sextortion perpetrator?",
      options: [
        "A stranger they met online",
        "A known person such as a former romantic partner or acquaintance",
        "A random hacker",
        "A government official"
      ],
      correctAnswer: "A known person such as a former romantic partner or acquaintance"
    },
    {
      id: "q3",
      type: "multipleChoice",
      question: "Why is sextortion not prosecuted under a specific federal or state law in many jurisdictions?",
      options: [
        "Sextortion is considered a minor offense",
        "There is no legal precedent for digital crimes",
        "Sextortion is not yet legally defined as a separate crime",
        "Victims rarely report it"
      ],
      correctAnswer: "Sextortion is not yet legally defined as a separate crime"
    },
    {
      id: "q4",
      type: "multipleChoice",
      question: "According to the data, were men or women more likely to report themselves as victim?",
      options: [
        "women",
        "Men",
        "equally likely",
        "There is no correlation"
      ],
      correctAnswer: "Men"
    },
    {
      id: "q5",
      type: "multipleChoice",
      question: "Which legal approaches are typically used to prosecute sextortion cases in the absence of specific sextortion laws?",
      options: [
        "Laws against sexting and online dating",
        "Laws related to hacking, child pornography, harassment, extortion, and privacy violations",
        "Civil lawsuits filed by families",
        "Community service programs"
      ],
      correctAnswer: "Laws related to hacking, child pornography, harassment, extortion, and privacy violations"
    }
  ];

  // Pre-quiz submission handler.
  const handlePreQuizSubmit = async (score, answers) => {
    const enteredName = answers["q1"] || "unknown";
    setUserName(enteredName);
    try {
      await addDoc(collection(db, "events"), {
        userId: enteredName,
        eventType: "pre_quiz",
        contentId: "PageA_prequiz",
        additionalData: { preQuizScore: score, answers },
        timestamp: new Date()
      });
    } catch (error) {
      console.error("Error recording pre quiz event:", error);
    }
    setShowPreQuiz(false);
  };

  // When the user clicks "Take Post Quiz", record the delay and show the post-quiz modal.
  const handlePostQuizButtonClick = async () => {
    if (flashcardStudyStart) {
      const timeToPostQuiz = Date.now() - flashcardStudyStart;
      try {
        await addDoc(collection(db, "events"), {
          userId: userName,
          eventType: "flashcard_to_postquiz_time",
          contentId: "PageA",
          additionalData: { timeToPostQuiz },
          timestamp: new Date()
        });
      } catch (error) {
        console.error("Error recording flashcard-to-postquiz time:", error);
      }
    }
    console.log("Setting showPostQuiz to true");
    setShowPostQuiz(true);
  };

  // Post-quiz submission handler.
  const handlePostQuizSubmit = async (score, answers) => {
    try {
      await addDoc(collection(db, "events"), {
        userId: userName,
        eventType: "post_quiz",
        contentId: "PageA_postquiz",
        additionalData: { postQuizScore: score, answers },
        timestamp: new Date()
      });
    } catch (error) {
      console.error("Error recording post quiz event:", error);
    }
    setShowPostQuiz(false);
  };

  return (
    <div className="pageA-wrapper">
      {showPreQuiz && (
        <div className="modal">
          <Quiz
            quizType="pre"
            questions={preQuizQuestions}
            onSubmit={handlePreQuizSubmit}
          />
        </div>
      )}

      {!showPreQuiz && !showPostQuiz && (
        <>
          <div className="flashcard-container pageA">
            {/* Flashcard 1: Victim Demographics and Survey Statistics */}
            <Flashcard
              cardId="flashcard-1"
              userId={userName}
              frontContent={
                <div>
                  <h2>Victim Demographics & Survey Statistics</h2>
                </div>
              }
              backContent={
                <div>
                  <ul>
                    <li>Survey of 1,631 cyber sextortion victims.</li>
                    <li>
                      Age Distribution:
                      <ul>
                        <li>Minors (&lt;18): 46%</li>
                        <li>Age 18-19: 28%</li>
                        <li>Age 20-22: 6%</li>
                        <li>Age 23-25: 6%</li>
                      </ul>
                    </li>
                    <li>
                      Most victims were targeted by someone known (e.g., former partners, acquaintances).
                    </li>
                    <li>
                      Gender Differences: Men (15.7%) are 1.17× more likely to report victimization and 1.43× more likely to report perpetration than women (13.2%).
                    </li>
                  </ul>
                  <div>
                    <h4>Age Distribution Pie Chart</h4>
                    <PieChart />
                  </div>
                </div>
              }
            />
            {/* Flashcard 2: Mechanisms and Motivations */}
            <Flashcard
              cardId="flashcard-2"
              userId={userName}
              frontContent={
                <div>
                  <h2>Mechanisms and Motivations of Cyber Sextortion</h2>
                </div>
              }
              backContent={
                <div>
                  <ul>
                    <li>
                      Cyber sextortion involves the threat to disseminate intimate images unless victims comply with demands.
                    </li>
                    <li>Demands can be sexual or non-sexual.</li>
                    <li>
                      Images are sometimes used by current or former partners to control behavior (e.g., to stay in unwanted relationships).
                    </li>
                    <li>
                      Some offenders demand payment to avoid distributing intimate videos.
                    </li>
                    <li>
                      Motivations include sex, power, dominance, coercion, and money.
                    </li>
                  </ul>
                </div>
              }
            />
            {/* Flashcard 3: Broader Context */}
            <Flashcard
              cardId="flashcard-3"
              userId={userName}
              frontContent={
                <div>
                  <h2>Sextortion in Broader Context</h2>
                </div>
              }
              backContent={
                <div>
                  <ul>
                    <li>
                      Sextortion is the threat to expose sexual images to coerce victims, often discussed alongside terms like sexting, nonconsensual pornography, and revenge pornography.
                    </li>
                    <li>
                      It frequently co-occurs with teen dating violence, where adolescents face high rates of physical and sexual abuse.
                    </li>
                    <li>
                      Victims may experience long-term health issues and problematic behaviors that affect their transition into adulthood.
                    </li>
                    <li>
                      Legally, “sextortion” is not specifically defined; prosecutions typically rely on other criminal statutes.
                    </li>
                  </ul>
                </div>
              }
            />
          </div>
          <button onClick={handlePostQuizButtonClick}>Take Post Quiz</button>
        </>
      )}

      {showPostQuiz && (
        <div className="modal">
          <Quiz
            quizType="post"
            questions={postQuizQuestions}
            onSubmit={handlePostQuizSubmit}
          />
        </div>
      )}
    </div>
  );
}

export default PageA;
