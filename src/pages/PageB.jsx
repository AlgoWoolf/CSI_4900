import React, { useState, useEffect } from "react";
import Flashcard from "../components/Flashcard.jsx";
import "../css/PageB.css";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import Quiz from "../components/Quiz.jsx";

function PageB() {
  const [showPreQuiz, setShowPreQuiz] = useState(true);
  const [showPostQuiz, setShowPostQuiz] = useState(false);
  const [userName, setUserName] = useState("user-123");
  const [flashcardStudyStart, setFlashcardStudyStart] = useState(null);

  // Start flashcard study timer once pre-quiz is completed.
  useEffect(() => {
    if (!showPreQuiz && flashcardStudyStart === null) {
      setFlashcardStudyStart(Date.now());
    }
  }, [showPreQuiz, flashcardStudyStart]);

  // Pre-quiz questions (same as PageA)
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

  // Post-quiz questions (same as PageA)
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
        contentId: "PageB_prequiz",
        additionalData: { preQuizScore: score, answers },
        timestamp: new Date()
      });
    } catch (error) {
      console.error("Error recording pre quiz event:", error);
    }
    setShowPreQuiz(false);
  };

  // Post-quiz submission handler.
  const handlePostQuizSubmit = async (score, answers) => {
    try {
      await addDoc(collection(db, "events"), {
        userId: userName,
        eventType: "post_quiz",
        contentId: "PageB_postquiz",
        additionalData: { postQuizScore: score, answers },
        timestamp: new Date()
      });
    } catch (error) {
      console.error("Error recording post quiz event:", error);
    }
    setShowPostQuiz(false);
  };

  // When the user clicks "Take Post Quiz", record the delay and show the post-quiz modal.
  const handlePostQuizButtonClick = async () => {
    if (flashcardStudyStart) {
      const timeToPostQuiz = Date.now() - flashcardStudyStart;
      try {
        await addDoc(collection(db, "events"), {
          userId: userName,
          eventType: "flashcard_to_postquiz_time",
          contentId: "PageB",
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

  return (
    <div className="pageB-wrapper">
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
          <div className="flashcard-container pageB">
            {/* Flashcard 1: Victim Demographics & Survey Data */}
            <Flashcard
              cardId="flashcard-1"
              userId={userName}
              frontContent={
                <div>
                  <h2>Victim Demographics & Survey Data</h2>
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
                      Majority were victimized by someone they knew (e.g., former romantic partners or acquaintances).
                    </li>
                    <li>
                      Gender Differences: Men (15.7%) report higher rates of victimization and perpetration than women (13.2%).
                    </li>
                  </ul>
                </div>
              }
            />

            {/* Flashcard 2: Mechanisms of Cyber Sextortion */}
            <Flashcard
              cardId="flashcard-2"
              userId={userName}
              frontContent={
                <div>
                  <h2>Mechanisms of Cyber Sextortion</h2>
                </div>
              }
              backContent={
                <div>
                  <ul>
                    <li>Offenders threaten to disseminate intimate images unless demands are met.</li>
                    <li>Demands may be sexual or non-sexual.</li>
                    <li>Images are used to control behavior (e.g., keeping victims in unwanted relationships).</li>
                    <li>Financial motives: demands for payments to avoid exposure of intimate videos.</li>
                    <li>Perpetrators pursue personal gain through sex, power, dominance, coercion, or money.</li>
                  </ul>
                </div>
              }
            />

            {/* Flashcard 3: Definitions & Legal Aspects */}
            <Flashcard
              cardId="flashcard-3"
              userId={userName}
              frontContent={
                <div>
                  <h2>Definitions & Legal Aspects</h2>
                </div>
              }
              backContent={
                <div>
                  <ul>
                    <li>Sextortion involves the threat to expose sexual images to coerce victims.</li>
                    <li>Often discussed alongside sexting, nonconsensual pornography, and revenge pornography.</li>
                    <li>Not legally defined as a separate crime in many jurisdictions.</li>
                    <li>Prosecutions use other statutes (hacking, child pornography, harassment, extortion, stalking, privacy violations).</li>
                  </ul>
                </div>
              }
            />

            {/* Flashcard 4: Sextortion & Teen Dating Violence */}
            <Flashcard
              cardId="flashcard-4"
              userId={userName}
              frontContent={
                <div>
                  <h2>Sextortion & Teen Dating Violence</h2>
                </div>
              }
              backContent={
                <div>
                  <ul>
                    <li>Sextortion often co-occurs with teen dating violence.</li>
                    <li>Adolescents face high rates of physical and sexual abuse in dating relationships.</li>
                    <li>Teens receive unwanted digital communications about sexual images.</li>
                    <li>Girls report higher rates of sexual cyber dating abuse and face negative social pressures.</li>
                  </ul>
                </div>
              }
            />

            {/* Flashcard 5: Long-Term Consequences & Youth Vulnerability */}
            <Flashcard
              cardId="flashcard-5"
              userId={userName}
              frontContent={
                <div>
                  <h2>Long-Term Consequences & Youth Vulnerability</h2>
                </div>
              }
              backContent={
                <div>
                  <ul>
                    <li>Sextortion affects both adults and adolescents, but minors are particularly vulnerable.</li>
                    <li>Youth victims report more health complaints and problem behaviors.</li>
                    <li>Negative outcomes can hinder their transition into adulthood.</li>
                    <li>Research shows: girls victimized as minors face higher risks of depression, substance abuse, and future intimate partner violence; boys often report increased antisocial behaviors.</li>
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

export default PageB;


