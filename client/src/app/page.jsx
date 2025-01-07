// 'use client'

// import { useState } from 'react'
// import { Container, Grid, Typography, Box, Paper } from '@mui/material'
// import ChatMessages from '@/components/ChatMessages'
// import ChatInput from '@/components/ChatInput'
// import SettingsPanel from '@/components/SettingsPanel'
// import { uploadPdf, sendQuery } from '@/lib/api'

// export default function Home() {
//   const [messages, setMessages] = useState([
//     { role: 'assistant', content: 'How can I assist you today?', sources: [] },
//   ])
//   const [selectedModel, setSelectedModel] = useState('Model1')
//   const [useSample, setUseSample] = useState(false)
//   const [useGeneralData, setUseGeneralData] = useState(false)
//   const [pdfPreview, setPdfPreview] = useState(null)
//   const [addToGeneralData, setAddToGeneralData] = useState(false)

//   const handleModelChange = (model) => {
//     setSelectedModel(model)
//   }

//   const handleUseSampleToggle = () => {
//     setUseSample(!useSample)
//     if (!useSample) {
//       setUseGeneralData(false)
//     }
//   }

//   const handleUseGeneralDataToggle = () => {
//     setUseGeneralData(!useGeneralData)
//   }

//   const handleAddToGeneralDataToggle = () => {
//     setAddToGeneralData(!addToGeneralData)
//   }

//   const handleFileUpload = async (file) => {
//     if (file && file.type === 'application/pdf') {
//       try {
//         const result = await uploadPdf(file)
//         alert(result.message)

//         const reader = new FileReader()
//         reader.onload = (e) => {
//           if (e.target && e.target.result) {
//             setPdfPreview(e.target.result)
//           } else {
//             throw new Error('Failed to read the file')
//           }
//         }
//         reader.onerror = (e) => {
//           throw new Error('Failed to read the file')
//         }
//         reader.readAsDataURL(file)
//       } catch (error) {
//         console.error('Error uploading PDF:', error)
//         alert('Failed to upload PDF: ' + (error instanceof Error ? error.message : 'Unknown error'))
//         setPdfPreview(null)
//       }
//     } else {
//       alert('Please upload a valid PDF file')
//       setPdfPreview(null)
//     }
//   }

//   const handleSendPrompt = async (prompt) => {
//     const newMessages = [...messages, { role: 'user', content: prompt }]
//     setMessages(newMessages)

//     try {
//       let index = 'general'
//       if (useSample) {
//         if (useGeneralData) {
//           index = addToGeneralData ? 'user_and_general_and_add' : 'user_and_general'
//         } else {
//           index = addToGeneralData ? 'user_and_add' : 'user'
//         }
//       }
//       const data = await sendQuery(prompt, index)
//       const assistantMessage = {
//         role: 'assistant',
//         content: data.response,
//         sources: data.sources,
//       }
//       setMessages([...newMessages, assistantMessage])
//     } catch (error) {
//       alert('Error: ' + error.message)
//     }
//   }

//   return (
//     <Container maxWidth="xlg" sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
//       <Box sx={{ my: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
//         <Typography variant="h3" component="h1" gutterBottom align="center" color="primary">
//           🩺 MediChat AI
//         </Typography>
//         <Typography variant="subtitle1" gutterBottom align="center" color="text.secondary">
//           Your Intelligent Medical Assistant for Anatomy & Physiology
//         </Typography>

//         <Grid container spacing={4} sx={{ mt: 4, flexGrow: 1 }}>
//           <Grid item xs={12} md={5}>
//             <Paper elevation={3} sx={{ p: 3, height: '100%', overflowY: 'auto' }}>
//               <SettingsPanel
//                 selectedModel={selectedModel}
//                 useSample={useSample}
//                 useGeneralData={useGeneralData}
//                 addToGeneralData={addToGeneralData}
//                 onModelChange={handleModelChange}
//                 onUseSampleToggle={handleUseSampleToggle}
//                 onUseGeneralDataToggle={handleUseGeneralDataToggle}
//                 onAddToGeneralDataToggle={handleAddToGeneralDataToggle}
//                 onFileUpload={handleFileUpload}
//                 pdfPreview={pdfPreview}
//               />
//             </Paper>
//           </Grid>
//           <Grid item xs={12} md={7} sx={{ height: 'calc(100vh - 200px)' }}>
//             <Paper 
//               elevation={3} 
//               sx={{ 
//                 p: 3, 
//                 height: '100%', 
//                 display: 'flex', 
//                 flexDirection: 'column' 
//               }}
//             >
//               <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}>
//                 <ChatMessages messages={messages} />
//               </Box>
//               <ChatInput onSendPrompt={handleSendPrompt} />
//             </Paper>
//           </Grid>
//         </Grid>
//       </Box>
//     </Container>
//   )
// }

'use client'

import { useState } from 'react'
import { Container, Grid, Typography, Box, Paper } from '@mui/material'
import ChatMessages from '@/components/ChatMessages'
import ChatInput from '@/components/ChatInput'
import SettingsPanel from '@/components/SettingsPanel'
import { uploadPdf, sendQuery } from '@/lib/api'

export default function Home() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'How can I assist you today?', sources: [] },
  ])
  const [selectedModel, setSelectedModel] = useState('Model1')
  const [useSample, setUseSample] = useState(false)
  const [useGeneralData, setUseGeneralData] = useState(false)
  const [pdfPreview, setPdfPreview] = useState(null)
  const [addToGeneralData, setAddToGeneralData] = useState(false)

  const handleModelChange = (model) => {
    setSelectedModel(model)
  }

  const handleUseSampleToggle = () => {
    setUseSample(!useSample)
    if (!useSample) {
      setUseGeneralData(false)
    }
  }

  const handleUseGeneralDataToggle = () => {
    setUseGeneralData(!useGeneralData)
  }

  const handleAddToGeneralDataToggle = () => {
    setAddToGeneralData(!addToGeneralData)
  }

  const handleFileUpload = async (file) => {
    if (file && file.type === 'application/pdf') {
      try {
        const result = await uploadPdf(file)
        alert(result.message)

        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target && e.target.result) {
            setPdfPreview(e.target.result)
          } else {
            throw new Error('Failed to read the file')
          }
        }
        reader.onerror = (e) => {
          throw new Error('Failed to read the file')
        }
        reader.readAsDataURL(file)
      } catch (error) {
        console.error('Error uploading PDF:', error)
        alert('Failed to upload PDF: ' + (error instanceof Error ? error.message : 'Unknown error'))
        setPdfPreview(null)
      }
    } else {
      alert('Please upload a valid PDF file')
      setPdfPreview(null)
    }
  }

  const handleSendPrompt = async (prompt) => {
    const newMessages = [...messages, { role: 'user', content: prompt }]
    setMessages(newMessages)

    try {
      let index = 'general'
      if (useSample) {
        if (useGeneralData) {
          index = addToGeneralData ? 'user_and_general_and_add' : 'user_and_general'
        } else {
          index = addToGeneralData ? 'user_and_add' : 'user'
        }
      }
      const data = await sendQuery(prompt, index)
      const assistantMessage = {
        role: 'assistant',
        content: data.response,
        sources: data.sources,
      }
      setMessages([...newMessages, assistantMessage])
    } catch (error) {
      alert('Error: ' + error.message)
    }
  }

  return (
    <Container maxWidth="xlg" sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ my: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h3" component="h1" gutterBottom align="center" color="primary">
          🩺 MediChat AI
        </Typography>
        <Typography variant="subtitle1" gutterBottom align="center" color="text.secondary">
          Your Intelligent Medical Assistant for Anatomy & Physiology
        </Typography>

        <Grid container spacing={4} sx={{ mt: 4, flexGrow: 1 }}>
          <Grid item xs={12} md={5} sx={{ height: 'calc(100vh - 200px)', overflowY: 'auto' }}>
            <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
              <SettingsPanel
                selectedModel={selectedModel}
                useSample={useSample}
                useGeneralData={useGeneralData}
                addToGeneralData={addToGeneralData}
                onModelChange={handleModelChange}
                onUseSampleToggle={handleUseSampleToggle}
                onUseGeneralDataToggle={handleUseGeneralDataToggle}
                onAddToGeneralDataToggle={handleAddToGeneralDataToggle}
                onFileUpload={handleFileUpload}
                pdfPreview={pdfPreview}
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={7} sx={{ height: 'calc(100vh - 200px)' }}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column' 
              }}
            >
              <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 1 }}>
                <ChatMessages messages={messages} />
              </Box>
              <ChatInput onSendPrompt={handleSendPrompt} />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

