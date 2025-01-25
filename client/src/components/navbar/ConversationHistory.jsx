import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Divider,
  Box
} from "@mui/material";
import { MessageCircle } from "lucide-react";
import MedicalLogo from "../logo/MedicalLogo";

const ConversationHistory = ({ conversations, onSelectConversation }) => {
  return (
    <List>
      <Box
        sx={{
          display: "flex",
          alignItems: "center", 
          justifyContent: "space-between", 
          mb: 2,
        }}
      >
        <MedicalLogo />
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1 }}
          style={{ fontWeight: "bold" }}
        >
          MediChat AI
        </Typography>

      </Box>
      <Typography variant="h6" sx={{ p: 2 }}>
        Conversation History
      </Typography>
      <Divider />
      {conversations.map((conversation) => (
        <ListItem
          button
          key={conversation.id}
          onClick={() => onSelectConversation(conversation.id)}
        >
          <ListItemIcon>
            <MessageCircle size={20} />
          </ListItemIcon>
          <ListItemText
            primary={conversation.title}
            secondary={conversation.timestamp}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default ConversationHistory;
