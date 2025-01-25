import React, { useState, useEffect } from "react"
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material"
import { Home, FileText, MessageCircle, Languages, Mic, User, MenuIcon, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import MedicalLogo from "@/components/logo/MedicalLogo";
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
const services = [
  { name: "Home", icon: Home, path: "/" },
  { name: "QA", icon: MessageCircle, path: "/qa" },
  { name: "Summary", icon: FileText, path: "/summary" },
  // { name: "Translation", icon: Languages, path: "/translation" },
  { name: "Text to Speech", icon: Mic, path: "/text-to-speech" },
]

const Navbar = ({ toggleSidebar }) => {
  const pathname = usePathname()

  const [userInfo, setUserInfo] = useState({ email: "", userId: "" })
  const [anchorEl, setAnchorEl] = useState(null)
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const mobileMenuOpen = Boolean(mobileMenuAnchorEl)

  useEffect(() => {
    const storedEmail = localStorage.getItem("email")
    const storedUserId = localStorage.getItem("userId")
    setUserInfo({
      email: storedEmail || "",
      userId: storedUserId || "",
    })
  }, [])

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchorEl(event.currentTarget)
  }

  const handleMobileMenuClose = () => {
    setMobileMenuAnchorEl(null)
  }

  return (
    <AppBar position="fixed" color="default" elevation={1}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleSidebar} sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <MedicalLogo />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} style={{ fontWeight: "bold" }}>
          MediChat AI
        </Typography>
        <Box sx={{ display: { xs: "none", md: "flex" } }}>
          {services.map((service) => (
            <Link href={`${service.path}`} key={service.name} passHref>
              <Button
                color="inherit"
                startIcon={<service.icon size={20} />}
                sx={{
                  ml: 1,
                  color: pathname == service.path ? "#4caf50" : "",
                  fontWeight: "bold",
                  borderBottom: pathname == service.path ? "1px solid #4caf50" : "",
                }}
              >
                {service.name}
              </Button>
            </Link>
          ))}
        </Box>
        <IconButton
          color="inherit"
          aria-label="user account"
          aria-controls="user-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          <User size={24} />
        </IconButton>
        <IconButton
          color="inherit"
          aria-label="menu"
          aria-controls="mobile-menu"
          aria-haspopup="true"
          onClick={handleMobileMenuOpen}
          sx={{ display: { xs: "flex", md: "none" } }}
        >
          <MenuIcon />
        </IconButton>
        <Menu
          id="user-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "user-button",
          }}
        >
          {userInfo.email && (
            <MenuItem disabled>
              <Typography variant="body2">{userInfo.email}</Typography>
            </MenuItem>
          )}
          <Divider />
          <Link href="/profile" passHref>
            <MenuItem onClick={handleClose}>Profile</MenuItem>
          </Link>
          <Link href="/login" passHref>
            <MenuItem onClick={handleClose}>Logout</MenuItem>
          </Link>
        </Menu>
        <Menu
          id="mobile-menu"
          anchorEl={mobileMenuAnchorEl}
          open={mobileMenuOpen}
          onClose={handleMobileMenuClose}
          MenuListProps={{
            "aria-labelledby": "mobile-menu-button",
          }}
        >
          {services.map((service) => (
            <Link href={`${service.path}`} key={service.name} passHref>
              <MenuItem onClick={handleMobileMenuClose}>
                <ListItemIcon>
                  <service.icon size={20} />
                </ListItemIcon>
                <ListItemText primary={service.name} />
              </MenuItem>
            </Link>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar

