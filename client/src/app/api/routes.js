export const SERVER = 'localhost:8080';
export const baseURL = '/api/v1'
export const LOGIN = baseURL + '/auth/login'
export const REGISTER = baseURL + '/auth/register'

export const UPLOAD_PDF = baseURL + '/files/upload-pdf'
export const GTE_PDF = (userId, inddexName) => baseURL + `/files/pdf/${userId}/${inddexName}`
export const GTE_PDFS = (userId) => baseURL + `/files/pdfs/${userId}`

export const GET_LLMS = baseURL + '/llm/all'
export const EDIT_LLM_STATS = baseURL + '/llm/edit-llm-stats'
export const  GET_USER_LLM_STATS = (userId) => baseURL + `/llm/llm-stats/${userId}`

export const GENERATE_SPEECH = baseURL + '/speech/generate-speech'

