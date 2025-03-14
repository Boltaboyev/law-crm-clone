const BASE_URL = "https://67d3bdee8bca322cc26ae701.mockapi.io"
const useFetch = () => {
    const response = ({url, method = "GET", data}) => {
        return fetch(`${BASE_URL}/${url}`, {
            method,
            headers: {"Content-Type": "application/json"},
            body: data,
        })
            .then((data) => data.json())
            .catch((err) => console.log(err))
    }
    return response
}



export {useFetch}