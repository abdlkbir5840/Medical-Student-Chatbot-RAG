import React from "react"
import { Box, Drawer, Toolbar } from "@mui/material"
import ConversationHistory from "@/components/navbar/ConversationHistory"

const Sidebar = ({ open, onClose }) => {
  const [conversations, setConversations] = React.useState([
    { id: "1", title: "Conversation 1", timestamp: "2023-05-01 10:00" },
    { id: "2", title: "Conversation 2", timestamp: "2023-05-02 14:30" },
    { id: "3", title: "Conversation 3", timestamp: "2023-05-03 09:15" },
  ])

  const handleSelectConversation = (id) => {
    console.log(`Selected conversation: ${id}`)
    // Implement logic to load the selected conversation
  }

  return (
    <Drawer
      variant="temporary"
      anchor="left"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
      sx={{
        display: { xs: "block", sm: "block" },
        "& .MuiDrawer-paper": { boxSizing: "border-box", width: 300 },
      }}
    >
      {/* <Toolbar /> */}
      <Box sx={{ overflow: "auto" }}>
        <ConversationHistory conversations={conversations} onSelectConversation={handleSelectConversation} />
      </Box>
    </Drawer>
  )
}

export default Sidebar

