import { Toolbar } from '@mui/material'

export default function Layout({ children }) {
    return (
        <div>
            {/* <Toolbar /> */}
            <main>{children}</main>
        </div>
    )
}