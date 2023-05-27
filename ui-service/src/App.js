/* IMPORTS */
import { Col, Container, Nav, Row, Button, Form, Badge } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { XCircleFill as Delete } from "react-bootstrap-icons";

const bff_url = process.env.BFF_SERVICE_URL || "http://34.151.114.10";

/**
 * BFF Endpoints
 * POST /create_note {title, content}
 * GET /get_notes {}
 * PUT /update_note/:id {title, content}
 * DELETE /delete_note/:id {}
 * POST /create_user {email, password}
 * POST /login {email, password}
 */

/* FUNCTIONS */
// auth
const new_user = (email, password) => {
  return axios.post(`${bff_url}/create_user`, {
    email: email,
    password: password,
  });
};

const login = async (email, password) => {
  try {
    const body = await axios.post(`${bff_url}/login`, {
      email: email,
      password: password,
    });
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${body.data.token}`;
    console.log(axios.defaults.headers.common["Authorization"]);
    return body.data.token;
  } catch (err) {
    console.log(err);
  }
};

// notes
const create_note = (title, content) => {
  return axios.post(`${bff_url}/create_note`, {
    title: title,
    content: content,
  });
};
const get_notes = () => {
  return axios.get(`${bff_url}/get_notes`);
};
const update_note = (id, title, content) => {
  return axios.put(`${bff_url}/update_note/${id}`, {
    title: title,
    content: content,
  });
};
const delete_note = (id) => {
  return axios.delete(`${bff_url}/delete_note/${id}`);
};

/* COMPONENTS */
const SideBar = ({ notes_props, onActive, onDelete }) => {
  const [notes, setNotes] = useState(notes_props);

  useEffect(() => {
    setNotes(notes_props);
  }, [notes_props]);

  return (
    <Nav className="w-auto">
      {notes &&
        notes.map((note) => (
          <Nav.Item
            className="w-100 border-bottom align-items-center"
            key={note._id}
          >
            <div className="d-flex align-items-center">
              <Nav.Link
                key={note._id}
                className="w-100"
                onClick={async () => await onActive(note._id)}
              >
                <strong>{note.title}</strong>
                <p className="m-0 text-muted">
                  {note.content.length > 20
                    ? note.content.substring(0, 20) + "..."
                    : note.content}
                </p>
              </Nav.Link>
              <Delete
                color="#df0000"
                className="m-2 h-5 me-3"
                onClick={async () => {
                  try {
                    await delete_note(note._id);
                    await onDelete();
                  } catch (err) {
                    console.log(err);
                  }
                }}
              />
            </div>
          </Nav.Item>
        ))}
    </Nav>
  );
};

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = props.onLogin;

  return (
    // react-bootstrap form group login
    <Form className="m-3">
      <Form.Group className="mb-1" controlId="formBasicEmail">
        <Form.Control
          onChange={async (e) => await setEmail(e.target.value)}
          type="email"
          className="mb-1"
          placeholder="Enter email"
          value={email}
        />
        <Form.Control
          onChange={async (e) => await setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          value={password}
        />
      </Form.Group>
      <Button
        onClick={async () => {
          try {
            await login(email, password);
            await onLogin();
          } catch (err) {
            console.log(err);
          }
        }}
        variant="primary"
        className="btn-sm me-1"
      >
        Login
      </Button>
      <Button
        onClick={async () => {
          try {
            const user = await new_user(email, password);
            console.log(user);
          } catch (err) {
            console.log(err);
          }
        }}
        variant="secondary"
        className="btn-sm me-1"
      >
        Sign Up
      </Button>
    </Form>
  );
};

const Note = ({ note_prop, onUpdate }) => {
  const [titleInFocus, setTitleFocus] = useState(false);
  const [contentInFocus, setContentFocus] = useState(true);
  const [note, setNote] = useState(note_prop);

  useEffect(() => {
    try {
      if (note_prop) {
        setNote({
          title: note_prop.title,
          content: note_prop.content,
          id: note_prop.id,
        });
      }
    } catch (err) {
      console.log(err);
    }
  }, [note_prop]);

  return (
    note && (
      <div className="h-100">
        <h1 className="m-0 py-2">
          {!titleInFocus && (
            <span onClick={async () => await setTitleFocus(true)}>
              {note.title}
            </span>
          )}
          {titleInFocus && (
            <input
              className=""
              onChange={async (e) =>
                await setNote({ ...note, title: e.target.value })
              }
              onBlur={async () => await setTitleFocus(false)}
              value={note.title}
            />
          )}
          <Button
            className="btn m-3"
            variant="primary"
            onClick={async () => {
              try {
                await onUpdate(note);
              } catch (err) {
                console.log(err);
              }
            }}
          >
            Save
          </Button>
        </h1>
        {!contentInFocus && (
          <p onClick={async () => await setContentFocus(true)}>
            {note.content}
          </p>
        )}
        {contentInFocus && (
          <textarea
            className="w-100 h-5"
            onChange={async (e) =>
              await setNote({ ...note, content: e.target.value })
            }
            onBlur={async () => await setContentFocus(false)}
            value={note.content}
          />
        )}
      </div>
    )
  );
};

function App() {
  const [notes, setNotes] = useState([]);
  const [active, setActive] = useState(null);
  const [token, setToken] = useState(null);
  const [isUpdating, setUpdating] = useState(false);

  useEffect(() => {
    get_notes()
      .then((res) => {
        console.log(res.data);
        setNotes(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token]);

  return (
    <Container className="pl-5 m-0 vh-100">
      <Row className="vh-100">
        <Col xs={3} className="bg-light w-10 p-0">
          <Login
            onLogin={async () => {
              await setToken(axios.defaults.headers.common["Authorization"]);
              const res = await get_notes();
              await setNotes(res.data);
            }}
          />
          {!token && <span className="text-danger px-2">Not logged in</span>}
          {token && (
            <div>
              <span className="text-success px-3">Logged in</span>
              <Button
                className="btn btn-danger btn-sm"
                onClick={async () => {
                  axios.defaults.headers.common["Authorization"] = "";
                  await setToken(null);
                }}
              >
                Logout
              </Button>
            </div>
          )}
          &nbsp;
          {token && (
            <SideBar
              notes_props={notes}
              onActive={async (id) => {
                const atv = notes.find((note) => note._id === id);
                atv["id"] = id;
                await setActive(atv);
              }}
              onDelete={async () => {
                try {
                  const res = await get_notes();
                  await setNotes(res.data);
                  await setActive(null);
                } catch (err) {
                  console.log(err);
                }
              }}
            />
          )}
          {token && (
            <Button
              className="btn-sm m-3 btn-secondary"
              onClick={async () => {
                await setActive(null);
                try {
                  await create_note("New Note", "Click here to edit the note");
                  const res = await get_notes();
                  console.log("called");
                  setNotes(res.data);
                } catch (err) {
                  console.log(err);
                }
              }}
            >
              New Note
            </Button>
          )}
          {isUpdating && (
            <Badge pill bg="warning" text="dark">
              Updating
            </Badge>
          )}
        </Col>
        <Col className="pt-5 ps-5">
          {active && token && (
            <Note
              isUpdating={isUpdating}
              note_prop={active}
              onUpdate={async (note) => {
                await setUpdating(true);
                await update_note(note.id, note.title, note.content);
                get_notes()
                  .then((res) => {
                    setNotes(res.data);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
                await setUpdating(false);
              }}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default App;
