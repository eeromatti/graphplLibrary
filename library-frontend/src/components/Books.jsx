import { ALL_BOOKS } from "../queries";
import { BOOKS_BY_GENRE } from "../queries";
import { useQuery } from "@apollo/client";
import { useState, useEffect } from "react";

const Books = (props) => {
  const [books, setBooks] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [allGenres, setAllGenres] = useState([]);

  //all books
  const { data: allBooksData, loading, error } = useQuery(ALL_BOOKS);

  //books by the genre selected
  const { data: genreBooksData } = useQuery(BOOKS_BY_GENRE, {
    variables: { genre: selectedGenre },
    skip: !selectedGenre, // Kyselyä ei suorita, jos genre ei ole valittu
  });

  // show all the books when entered the site
  useEffect(() => {
    if (allBooksData) {
      setBooks(allBooksData.allBooks); 
    }
  }, [allBooksData]); // update books when allBooksData updated

  // show books by genre
  useEffect(() => {
    if (genreBooksData) {
      setBooks(genreBooksData.allBooks); // update books when genre set
    }
  }, [genreBooksData]); 

  // fetch all genres when all books fetched
  useEffect(() => {
    if (allBooksData) {
      const genres = [
        ...new Set(allBooksData.allBooks.flatMap((book) => book.genres)),
      ];
      setAllGenres(genres); 
    }
  }, [allBooksData]); 

  // loading and error handler
  if (!props.show) {
    return null;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.error("GraphQL error:", error);
    return <div>Error loading books</div>;
  }

  return (
    <div>
      <h2>Books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>Author</th>
            <th>Published</th>
          </tr>
          {books.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Genre-painikkeet */}
      {allGenres.map((genre, index) => (
        <button key={index} onClick={() => setSelectedGenre(genre)}>
          {genre}
        </button>
      ))}
      {/* "Kaikki genret" -painike */}
      <button onClick={() => setBooks(allBooksData.allBooks)}>All genres</button>
    </div>
  );
};

export default Books;



// import { ALL_BOOKS } from "../queries";
// import { useQuery } from "@apollo/client";
// import { useState, useEffect } from "react";

// const Books = (props) => {

//   const [books, setBooks] = useState([]);

//   const result = useQuery(ALL_BOOKS, {
//     // pollInterval: 2000,
//   });

//   useEffect(() => {
//     if (result.data) {
//       setBooks(result.data.allBooks);
//     }
//   }, [result.data]);

//   if (!props.show) {
//     return null;
//   }

//   if (result.loading) {
//     return <div>loading...</div>;
//   }

//   if (result.error) {
//     console.error("graphwl error:", result.error);
//   }

//   const allGenres = [...new Set(books.flatMap((book) => book.genres))];

//   const filter = (genre) => {
//     if (genre === null) {
//       setBooks(result.data.allBooks);
//     } else {
//       const filteredBooks = genre
//       ? books.filter((book) => book.genres.includes(genre))
//       : books;
//     // console.log("filteredBooks:", filteredBooks);
//     if (filteredBooks) {
//       setBooks(filteredBooks);
//     }
//     } 
//   };

//   return (
//     <div>
//       <h2>books</h2>

//       <table>
//         <tbody>
//           <tr>
//             <th></th>
//             <th>author</th>
//             <th>published</th>
//           </tr>
//           {books.map((a) => (
//             <tr key={a.title}>
//               <td>{a.title}</td>
//               <td>{a.author.name}</td>
//               <td>{a.published}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       {allGenres.map((genre, index) => (
//         <button key={index} onClick={() => filter(genre)}>
//           {genre}
//         </button>        
//       ))}
//       <button onClick={() => filter(null)}>all genres</button>
//     </div>
//   );
// };

// export default Books;
