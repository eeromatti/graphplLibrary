import { ALL_AUTHORS } from "../queries";
import { EDIT_AUTHOR } from "../queries";
import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import Select from "react-select";

const Authors = (props) => {
  const [name, setName] = useState(null);
  const [born, setBorn] = useState("");
  // const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [changeBirthYear] = useMutation(EDIT_AUTHOR);
  const auth = useQuery(ALL_AUTHORS, {
    pollInterval: 2000,
  });
  // console.log("auth:", auth.data);

  const submit = async (event) => {
    event.preventDefault();
    changeBirthYear({ variables: { name, born } });
    setName("");
    setBorn("");
  };

  if (!props.show) {
    return null;
  }

  if (auth.loading) {
    return <div>loading...</div>;
  }

  const authors = auth.data.allAuthors;

  const authorOptions = authors.filter((a) => a.born === null);
  // console.log("authorOptions:", authorOptions);
  const formattedAuthorOptions = authorOptions.map((author) => ({
    value: author.name,
    label: author.name,
  }));
  // console.log("formattedAuthorOptions:", formattedAuthorOptions);

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              {/* <td>{a.bookCount}</td> */}
            </tr>
          ))}
        </tbody>
      </table>
      <h2>set birthyear</h2>
      <form>
        <Select
          defaultValue={name}
          onChange={(selectedOption) => setName(selectedOption.value)}
          options={formattedAuthorOptions}
        />
        <div>
          born
          <input
            value={born}
            onChange={({ target }) => setBorn(parseInt(target.value))}
          />
        </div>
        <button onClick={submit} type="button">
          update author
        </button>
      </form>
    </div>
  );
};

export default Authors;
