"use client";
import React, { useState, useEffect } from "react";
import {
  Select,
  MenuItem,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Checkbox,
  Tooltip,
  CardContent,
  IconButton,
} from "@mui/material";
import {
  CloudUpload,
  InfoOutlined,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";
import dynamic from "next/dynamic";
const PdfViewer = dynamic(() => import("./PdfViewer"), { ssr: false });

const SettingsPanel = ({
  selectedModel,
  selectedPdf,
  useSample,
  useGeneralData,
  onModelChange,
  onPdfChange,
  onUseSampleToggle,
  onUseGeneralDataToggle,
  onFileUpload,
  pdfPreview,
  addToGeneralData,
  onAddToGeneralDataToggle,
  availableModels,
  availablePdfs,
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileUpload(file);
      setIsSettingsOpen(false);
    }
  };
  return (
    <Box className="flex flex-col h-full">
      <Button
        variant="outlined"
        startIcon={isSettingsOpen ? <ExpandLess /> : <ExpandMore />}
        className="mb-2 w-full"
        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
      >
        {isSettingsOpen ? "Hide Settings" : "Show Settings"}
      </Button>

      {isSettingsOpen && (
        <div className="mb-4">
          <Typography variant="h6" gutterBottom>
            Settings
          </Typography>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-5">
              <FormControl
                variant="outlined"
                className="min-w-[120px] flex-grow"
              >
                <InputLabel id="model-select-label">Model</InputLabel>
                <Select
                  labelId="model-select-label"
                  value={selectedModel}
                  onChange={(e) => onModelChange(e.target.value)}
                  label="Model"
                  size="small"
                >
                  {availableModels.map((model) => (
                    <MenuItem
                      key={model.name}
                      value={model.name}
                      disabled={model.status == "active" ? false : true}
                    >
                      {model.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {useSample && (
                 <FormControl
                 variant="outlined"
                 className="min-w-[120px] flex-grow"
               >
                 <InputLabel id="model-select-label">PDF</InputLabel>
                 <Select
                   labelId="model-select-label"
                   value={selectedPdf}
                   onChange={(e) => onPdfChange(e.target.value)}
                   label="PDF"
                   size="small"
                 >
                   {availablePdfs.map((pdf) => (
                     <MenuItem key={pdf.indexName} value={pdf.indexName} disabled={false}>
                       {pdf.name}
                     </MenuItem>
                   ))}
                 </Select>
               </FormControl>
              )}
             
            </div>
            <div className="flex flex-wrap items-center gap-5">
              {/* Use Sample Checkbox */}
              <Tooltip title="Use PDF-based Conversation" arrow>
                <div className="flex items-center">
                  <Checkbox
                    checked={useSample}
                    onChange={onUseSampleToggle}
                    color="primary"
                    size="small"
                  />
                  <Typography variant="body2" className="flex items-center">
                    Use PDF
                    <IconButton size="small" className="ml-1">
                      <InfoOutlined fontSize="small" />
                    </IconButton>
                  </Typography>
                </div>
              </Tooltip>

              {useSample && (
                <>
                  {/* Include General Data Checkbox */}
                  <Tooltip title="Include general data in conversation" arrow>
                    <div className="flex items-center">
                      <Checkbox
                        checked={useGeneralData}
                        onChange={onUseGeneralDataToggle}
                        color="primary"
                        size="small"
                      />
                      <Typography variant="body2" className="flex items-center">
                        Include Data
                        <IconButton size="small" className="ml-1">
                          <InfoOutlined fontSize="small" />
                        </IconButton>
                      </Typography>
                    </div>
                  </Tooltip>

                  {/* Add to General Data Checkbox */}
                  <Tooltip title="Add my data to general data" arrow>
                    <div className="flex items-center">
                      <Checkbox
                        checked={addToGeneralData}
                        onChange={onAddToGeneralDataToggle}
                        color="primary"
                        size="small"
                      />
                      <Typography variant="body2" className="flex items-center">
                        Add Data
                        <IconButton size="small" className="ml-1">
                          <InfoOutlined fontSize="small" />
                        </IconButton>
                      </Typography>
                    </div>
                  </Tooltip>
                  
                  {/* File Upload Button */}
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="pdf-upload"
                    />
                    <label htmlFor="pdf-upload">
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<CloudUpload />}
                        size="small"
                        className="normal-case"
                      >
                        {pdfPreview ? "Change PDF" : "Upload PDF"}
                      </Button>
                    </label>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </div>
      )}
      {useSample && pdfPreview && (
        <div className={`flex-grow ${isSettingsOpen ? "mt-4" : "h-full"}`}>
          <div className=" w-full border rounded-md overflow-scroll scrollbar-hidden h-full">
            {/* PDF Viewer would go here */}
            <Typography variant="body1" className="p-0">
              <PdfViewer file={pdfPreview} />
            </Typography>
          </div>
        </div>
      )}
    </Box>
  );
};

export default SettingsPanel;
