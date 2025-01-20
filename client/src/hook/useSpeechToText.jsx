import { useState, useEffect, useCallback } from 'react';

const useSpeechToText = () => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [recognition, setRecognition] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) || !navigator.mediaDevices) {
      console.error('Speech recognition or media devices not supported in this browser.');
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = 'en-US';

    recognitionInstance.onresult = (event) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptSegment = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          setTranscript((prev) => prev + transcriptSegment);
        } else {
          interimTranscript += transcriptSegment;
        }
      }
    };
    recognitionInstance.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };

    setRecognition(recognitionInstance);
    return () => recognitionInstance.stop();
  }, []);

  const startListening = useCallback(async () => {
    if (recognition && !isListening) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      let chunks = [];

      recorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        chunks = [];
      };

      recorder.start();
      setMediaRecorder(recorder);
      recognition.start();
      setIsListening(true);
    }
  }, [recognition, isListening]);

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);

      if (mediaRecorder) {
        mediaRecorder.stop();
      }
    }
  }, [recognition, isListening, mediaRecorder]);

  const resetTranscript = () => {
    setTranscript('');
    setAudioBlob(null);
  };

  return {
    transcript,
    isListening,
    audioBlob,
    startListening,
    stopListening,
    resetTranscript,
  };
};

export default useSpeechToText;
