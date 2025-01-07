'use client'

import { useRef, useEffect } from 'react'
import { Box, Typography, Chip, Avatar } from '@mui/material'

const ChatMessages = ({ messages }) => {
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages])

  return (
    <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2, height: 'calc(100% - 10px)' }}>
      {messages.map((message, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
            mb: 2,
          }}
        >
          <Box
            sx={{
              maxWidth: '70%',
              backgroundColor: message.role === 'user' ? 'primary.main' : 'secondary.main',
              color: 'white',
              borderRadius: 2,
              p: 2,
            }}
          >
            <Typography variant="body1">{message.content}</Typography>
            {message.sources && message.sources.length > 0 && (
              <Box sx={{ mt: 1 }}>
                {message.sources.map((source, i) => (
                  <Chip
                    key={i}
                    label={source.length > 20 ? `${source.slice(0, 17)}...` : source}
                    size="small"
                    onClick={() => alert(`Full Source: ${source}`)}
                    sx={{ mr: 0.5, mb: 0.5, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                  />
                ))}
              </Box>
            )}
          </Box>
          <Avatar
            sx={{
              ml: message.role === 'user' ? 1 : 0,
              mr: message.role === 'assistant' ? 1 : 0,
              bgcolor: message.role === 'user' ? 'primary.dark' : 'secondary.dark',
            }}
          >
            {message.role === 'user' ? '👤' : '🤖'}
          </Avatar>
        </Box>
      ))}
      <div ref={messagesEndRef} />
    </Box>
  )
}

export default ChatMessages

