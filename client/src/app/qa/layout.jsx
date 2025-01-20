'use client'
import { Toolbar } from '@mui/material'
import Navbar from '@/components/navbar/Navbar';

export default function Layout({ children }) {
    return (
        <div>
            <Navbar />
            <Toolbar />
            <main>{children}</main>
        </div>
    )
}