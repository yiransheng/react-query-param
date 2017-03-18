import React from "react";
import { connect } from "react-redux";
import { styled } from "styletron-react";

import { getMessages } from "./ducks";
import { Message } from "./Messages";

const ListContainer = styled("ul", () => ({
  width: "500px",
  padding: 0
}));

const Heading = styled("h2", () => ({
  margin: 0,
  backgroundColor: "#f0f0f0",
  padding: "1rem",
  borderBottom: "1px solid #ccc",
  borderTop: "1px solid #ccc",
}));

const Messages = connect(state => {
  return { messages: getMessages(state) };
})(({ messages }) => {
  return (
    <ListContainer>
      <Heading>✉ All Messages</Heading>
      {messages.map(msg => <Message {...msg} key={msg.id} />)}
    </ListContainer>
  );
});

export default function Sidebar() {
  return <Messages />;
}
