import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Countdown from './⏳ Countdown';
import ProgressBar from './ProgressBar';

// Response types from backend
interface GetTextResponse {
  text: string;
}

interface SubmitResponse {
  timeTaken: string;
  wpm: string;
  accuracy: string;
  averageWpm: string;
}

const TypingTest: React.FC = () => {
  const [text, setText] = useState<string>("");
  const [typedText, setTypedText] = useState<string>("");
  const [result, setResult] = useState<SubmitResponse | null>(null);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string>("");

  // Fetch text when component loads
  useEffect(() => {
    fetchText();
  }, []);

  // Fetch random text from backend
  const fetchText = async () => {
    try {
      const res = await axios.get<GetTextResponse>('http://127.0.0.1:5000/api/get_text');
      setText(res.data.text);
      setTypedText("");
      setResult(null);
      setProgress(0);
      setError("");
    } catch (err) {
      console.error("Error fetching text:", err);
      setError("Could not fetch text. Please try again later.");
    }
  };

  // Handle typing & update progress
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTypedText(value);
    setProgress((value.length / text.length) * 100);
  };
  
  // Submit typed text to backend
  const handleSubmit = async () => {
    if (!typedText.trim()) {
      setError("Please type something before submitting!");
      return;
    }

    setError(""); // clear previous error
    try {
      console.log("Submitting typedText:", typedText);
      const res = await axios.post<SubmitResponse>(
        'http://127.0.0.1:5000/api/submit_text',
        { typedText }
      );
      setResult(res.data);
      setIsStarted(false);
      setTypedText("");
      setProgress(0);
    } catch (err) {
      console.error("Error submitting text:", err);
      setError("Could not submit text. Please try again.");
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Typing Speed Tester</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!isStarted && !result && (
        <Countdown onComplete={() => setIsStarted(true)} />
      )}

      {isStarted && (
        <>
          <p>Type this text:</p>
          <p style={{ background: "#eee", padding: 10 }}>{text}</p>
          <input
            type="text"
            value={typedText}
            onChange={handleTyping}
            style={{ width: "100%", fontSize: 18 }}
            placeholder="Start typing here..."
          />
          <ProgressBar progress={progress} />
          <button onClick={handleSubmit}>Submit</button>
        </>
      )}

      {result && (
        <div style={{ marginTop: 20 }}>
          <p>Time Taken: {result.timeTaken} sec</p>
          <p>WPM: {result.wpm}</p>
          <p>Accuracy: {result.accuracy}%</p>
          <p>Average WPM: {result.averageWpm}</p>
          <button onClick={fetchText}>Try New Text</button>
        </div>
      )}
    </div>
  );
};

export default TypingTest;
