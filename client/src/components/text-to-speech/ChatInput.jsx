import React, { useState, useEffect } from 'react';
import { IconButton, Paper, TextField, InputAdornment } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import SendIcon from '@mui/icons-material/Send';

const ChatInput = ({ onSendPrompt }) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i][0].transcript;
          transcript += result;
        }
        setInputText(transcript);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };

      setRecognition(recognitionInstance);
    } else {
      console.error('Speech recognition is not supported in this browser.');
    }

    // Initialize MediaRecorder to capture audio
    const initRecorder = async () => {
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

      setMediaRecorder(recorder);
    };

    initRecorder();

  }, []);

  const handleMicClick = () => {
    if (isListening) {
      recognition.stop();
      mediaRecorder.stop();
      setIsListening(false);
    } else {
      recognition.start();
      mediaRecorder.start();
      setIsListening(true);
    }
  };

  const handleSendClick = () => {
    if (inputText.trim()) {
      onSendPrompt(audioBlob, inputText);
      setInputText('');
      setAudioBlob(null);  // Reset the audioBlob after sending
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
        mt: 2,
        borderRadius: '16px',
        backgroundColor: 'background.paper',
        height: '60px',
      }}
    >
      <IconButton
        color={isListening ? 'error' : 'primary'}
        onClick={handleMicClick}
        sx={{
          width: 64,
          height: 64,
        }}
      >
        <MicIcon fontSize="large" />
      </IconButton>
      <TextField
        fullWidth
        variant="standard"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Speak or type your message..."
        sx={{
          mx: 2,
          '& .MuiInput-underline:before': { borderBottomColor: 'transparent' },
          '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottomColor: 'transparent' },
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleSendClick} disabled={!inputText.trim()}>
                <SendIcon color={inputText.trim() ? 'primary' : 'disabled'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Paper>
  );
};

export default ChatInput;
