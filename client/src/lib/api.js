export const uploadPdf = async (file) => {
  return { success: true, message: 'PDF uploaded successfully (static response)' }
}

export const sendQuery = async (query, index) => {
  let response = `This is a static response to your query: "${query}". `
  switch (index) {
    case 'user':
      response += "This response is based only on your uploaded PDF."
      break
    case 'user_and_add':
      response += "This response is based on your uploaded PDF, and your data will be added to our general data."
      break
    case 'user_and_general':
      response += "This response is based on both your uploaded PDF and general medical knowledge."
      break
    case 'user_and_general_and_add':
      response += "This response is based on both your uploaded PDF and general medical knowledge, and your data will be added to our general data."
      break
    default:
      response += "This response is based on general medical knowledge."
  }
  return {
    response,
    sources: ['Static Source 1', 'Static Source 2']
  }
}

