import React, { useState, useRef, useEffect } from "react";
import '../css/Flashcard.css';
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";

function Flashcard({ frontContent, backContent, cardId, userId }) {
  const [flipped, setFlipped] = useState(false);
  const startTimeRef = useRef(Date.now());

  // Optionally, you can reset the timer if needed when the card content changes.
  useEffect(() => {
    startTimeRef.current = Date.now();
  }, [frontContent, backContent]);

  const handleClick = async () => {
    // Calculate individual time spent on this flashcard
    const timeSpent = Date.now() - startTimeRef.current;

    // Record the individual flashcard time event to Firestore
    try {
      await addDoc(collection(db, "events"), {
        userId: userId || "unknown",
        eventType: "flashcard_time_spent",
        contentId: cardId || "unknown",
        additionalData: { timeSpent },
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Error recording flashcard time event:", error);
    }

    // Toggle the flashcard's flipped state
    setFlipped(!flipped);

    // Record the flashcard click event (optional additional logging)
    try {
      await addDoc(collection(db, "events"), {
        userId: userId || "unknown",
        eventType: "flashcard_click",
        contentId: cardId || "unknown",
        additionalData: { flipped: !flipped },
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Error recording flashcard click event:", error);
    }
  };

  return (
    <div className={`flashcard ${flipped ? "flipped" : ""}`} onClick={handleClick}>
      <div className="flashcard-inner">
        <div className="flashcard-front">{frontContent}</div>
        <div className="flashcard-back">{backContent}</div>
      </div>
    </div>
  );
}

export default Flashcard;
