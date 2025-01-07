'use client'

import { useState } from 'react'
import { TextField, Button, Box } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'

const ChatInput = ({ onSendPrompt }) => {
  const [inputPrompt, setInputPrompt] = useState('')

  const handleSendPrompt = () => {
    if (inputPrompt.trim()) {
      onSendPrompt(inputPrompt)
      setInputPrompt('')
    }
  }

  return (
    <Box sx={{ display: 'flex', mt: 1 }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Ask me anything about anatomy & physiology..."
        value={inputPrompt}
        onChange={(e) => setInputPrompt(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSendPrompt()}
        sx={{ mr: 1 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSendPrompt}
        endIcon={<SendIcon />}
      >
        Send
      </Button>
    </Box>
  )
}

export default ChatInput

