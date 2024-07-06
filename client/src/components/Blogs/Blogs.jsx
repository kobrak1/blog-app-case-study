import { useEffect, useState } from "react"
import blogService from '../../services/blogService'

const Blogs = () => {
    const [blogs, setBlogs] = useState([])

    useEffect(() => {
        blogService.getAll()
          .then(data => setBlogs(data))
    }, [blogs])

    return(
        <div>
            {blogs.map(item =>
                <li key={item.id} className="flex container border border-slate-200 rounded-md max-w-custom p-1 my-2 mx-auto text-slate-600"> {item.content} </li>
            )}
        </div>
    )
}

export default Blogs