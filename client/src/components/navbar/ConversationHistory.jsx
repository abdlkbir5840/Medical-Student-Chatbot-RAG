import  React from "react"
import { List, ListItem, ListItemText, ListItemIcon, Typography, Divider } from "@mui/material"
import { MessageCircle } from "lucide-react"


const ConversationHistory = ({ conversations, onSelectConversation }) => {
  return (
    <List>
      <Typography variant="h6" sx={{ p: 2 }}>
        Conversation History
      </Typography>
      <Divider />
      {conversations.map((conversation) => (
        <ListItem button key={conversation.id} onClick={() => onSelectConversation(conversation.id)}>
          <ListItemIcon>
            <MessageCircle size={20} />
          </ListItemIcon>
          <ListItemText primary={conversation.title} secondary={conversation.timestamp} />
        </ListItem>
      ))}
    </List>
  )
}

export default ConversationHistory

