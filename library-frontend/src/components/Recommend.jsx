import { ALL_BOOKS } from "../queries";
import { ME } from "../queries"
import { useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
// import { jwtDecode } from "jwt-decode"

const Recommend = (props) => {

  const [books, setBooks] = useState([]);

  //fetch all books and current user
  const result = useQuery(ALL_BOOKS, {
  });
  const currentUser = useQuery(ME);

  //handle the lag of fetching the books 
  useEffect(() => {
    if (result.data) {
      setBooks(result.data.allBooks);
    }
  }, [result.data]);

  if (!props.show) {
    return null;
  }

  if (result.loading) {
    return <div>loading...</div>;
  }

  if (result.error) {
    console.error("graphwl error:", result.error);
  }

  //handle the lag of fetching the current user 
  if (currentUser.loading) {
    return <div>Loading...</div>
  }

  if (currentUser.error) {
    <div>
      Error: {result.error?.message || currentUser.error?.message}
    </div>
    }

  const favGenre = currentUser.data.me.favoriteGenre

  const recommend = books
  ? books.filter((book) => book.genres.includes(favGenre))
  : []

  if (recommend.length > 0) {
    return (
        <div>
          <h2>recommendations</h2>
          <p>books in your favorite genre <strong>{favGenre}</strong></p>
          <table>
            <tbody>
              <tr>
                <th></th>
                <th>author</th>
                <th>published</th>
              </tr>
              {recommend.map((a) => (
                <tr key={a.title}>
                  <td>{a.title}</td>
                  <td>{a.author.name}</td>
                  <td>{a.published}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else {
    return (
        <div>
            <p>No favorite genre available</p>
        </div>
        )
    }
}

export default Recommend;
