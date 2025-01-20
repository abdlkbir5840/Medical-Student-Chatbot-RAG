import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8000/",
})

export const uploadPdf = async (file, storeType, indexName, processId) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('store_type', storeType);
  formData.append('indexName', indexName);
  formData.append('process_id', processId);

  try {
    const response = await axios.post('http://localhost:8000/upload-pdf/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('File uploaded successfully:', response.data);
    return response.data; 
  } catch (error) {
    console.error('Error uploading file:', error);
    if (error.response) {
      console.error('Error Response:', error.response.data);
    } else {
      console.error('Error Message:', error.message);
    }
    throw error; 
  }
};

export const sendQuery = async (query, indexName, selectedModel, search_type) => {
  console.log(query, indexName, selectedModel, search_type);
  const res = await instance.post("query/", { query, index_name: indexName, model_name: selectedModel, search_type });

  return res.data;
};


