import axios from 'axios'

const baseUrl = 'http://localhost:3001/api/blogs'

// get all blogs
const getAll = async () => {
    const response = await axios.get(baseUrl)
    return response.data
}

// get a specific blog
const getBlog = async (id) => {
    const response = await axios.get(`${baseUrl}/${id}`)
    return response.data
}

export default {
    getAll,
    getBlog,
}