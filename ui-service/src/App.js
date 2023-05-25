/* IMPORTS */
import { Col, Container, Nav, Row } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";

/* FUNCTIONS */

/* COMPONENTS */

const SideBar = () => {
  return (
    <Nav className="w-auto pt-4">
      <Nav.Item className="w-100 pt-5">
        <Nav.Link className="ps-4">Active</Nav.Link>
        <Nav.Link className="bg-white ps-4 w-100">Active asdasd</Nav.Link>
        <Nav.Link className="ps-4">Active asdjmaksd</Nav.Link>
        <Nav.Link className="ps-4">Active ajsdnkajsd</Nav.Link>
      </Nav.Item>
    </Nav>
  );
};

const Note = ({ id }) => {
  const [titleInFocus, setTitleFocus] = useState(false);
  const [contentInFocus, setContentFocus] = useState(true);
  const [content, setContent] = useState("content");
  const [title, setTitle] = useState("title");

  return (
    <div>
      <h1 className="m-0 py-2">
        {!titleInFocus && (
          <span onClick={() => setTitleFocus(true)}>{title}</span>
        )}
        {titleInFocus && (
          <input
            className="w-100"
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => setTitleFocus(false)}
            value={title}
          />
        )}
      </h1>
      {!contentInFocus && (
        <p onClick={() => setContentFocus(true)}>{content}</p>
      )}
      {contentInFocus && (
        <textarea
          className="w-100"
          onChange={(e) => setContent(e.target.value)}
          onBlur={() => setContentFocus(false)}
          value={content}
        />
      )}
    </div>
  );
};

function App() {
  return (
    <Container className="pl-5 m-0 vh-100">
      <Row className="vh-100">
        <Col xs={3} className="bg-light w-10 p-0">
          <SideBar />
        </Col>
        <Col className="pt-5 ps-5">
          <Note content="asdnkajsd" />
        </Col>
      </Row>
    </Container>
  );
}

export default App;
