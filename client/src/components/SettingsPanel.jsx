'use client'
import dynamic from 'next/dynamic';

import { Select, MenuItem, Button, Box, Typography, FormControl, InputLabel, Switch, FormControlLabel } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
// import PdfViewer from './PdfViewer'
const PdfViewer = dynamic(() => import('.//PdfViewer'), { ssr: false });


const SettingsPanel = ({
  selectedModel,
  useSample,
  useGeneralData,
  onModelChange,
  onUseSampleToggle,
  onUseGeneralDataToggle,
  onFileUpload,
  pdfPreview,
  addToGeneralData,
  onAddToGeneralDataToggle,
}) => {
  const availableModels = ['Model1', 'Model2', 'Model3']

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Settings</Typography>
      <FormControl fullWidth margin="normal">
        <InputLabel id="model-select-label">Model</InputLabel>
        <Select
          labelId="model-select-label"
          value={selectedModel}
          onChange={(e) => onModelChange(e.target.value)}
          label="Model"
        >
          {availableModels.map((model) => (
            <MenuItem key={model} value={model}>
              {model}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControlLabel
        control={
          <Switch
            checked={useSample}
            onChange={onUseSampleToggle}
            color="primary"
          />
        }
        label="Use PDF-based Conversation"
        sx={{ my: 2 }}
      />

      {useSample && (
        <FormControlLabel
          control={
            <Switch
              checked={useGeneralData}
              onChange={onUseGeneralDataToggle}
              color="primary"
            />
          }
          label="Include general data in conversation"
          sx={{ mb: 2 }}
        />
      )}

      {useSample && (
        <FormControlLabel
          control={
            <Switch
              checked={addToGeneralData}
              onChange={onAddToGeneralDataToggle}
              color="primary"
            />
          }
          label="Add my data to general data"
          sx={{ mb: 2 }}
        />
      )}

      {useSample && (
        <Box>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => e.target.files && onFileUpload(e.target.files[0])}
            style={{ display: 'none' }}
            id="pdf-upload"
          />
          <label htmlFor="pdf-upload">
            <Button
              variant="outlined"
              component="span"
              fullWidth
              startIcon={<CloudUploadIcon />}
              sx={{ mb: 2 }}
            >
              Upload PDF
            </Button>
          </label>
          {pdfPreview && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
              </Typography>
              <PdfViewer url={pdfPreview} />
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}

export default SettingsPanel
