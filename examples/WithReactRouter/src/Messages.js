import React from "react";
import { connect } from "react-redux";
import { styled } from "styletron-react";

import { Link } from "react-router-dom";
import TimeAgo from "react-timeago";
import Filters from "./Filters";
import { getUser, getFilteredMessages } from "./ducks";

const H3 = styled("h3", props => {
  return {
    fontWeight: props.bold ? 700 : 400,
    textTransform: props.bold ? "uppercase" : "none",
    margin: 0,
    padding: "0.25rem 0"
  };
});
const List = styled("li", () => ({
  listStyleType: "none",
  border: "1px solid #ccc",
  borderTopColor: "transparent",
  padding: "0.5em 1em",
  marginBottom: 2,
  maxWidth: 960
}));
const Sender = styled("div", () => ({
  borderTop: "1px solid #ccc",
  paddingTop: "0.5rem",
  fontSize: "0.85rem",
  fontWeight: "lighter",
  fontFamily: "sans-serif",
  color: "#777"
}));
const MessagesContainer = styled("div", () => ({
  width: "100%",
  flexGrow: 2,
  paddingLeft: "1em"
}));

const Message = connect((state, ownProps) => {
  const fromUser = getUser(state, { userId: ownProps.fromUser });
  return {
    fromUser
  };
})(({ id, title, fromUser, unread, date, detail }) => {
  let heading;
  if (detail) {
    heading = <H3 bold={true}>{title}</H3>;
  } else {
    heading = (
      <H3 bold={unread}>
        <Link to={`/${id}/`}>{title}</Link>
      </H3>
    );
  }
  return (
    <List key={id}>
      {heading}
      <Sender>
        <span>From: </span>
        <span>{fromUser.name}</span>
        {" | "}
        <span><TimeAgo date={date} /></span>
      </Sender>
    </List>
  );
});

const Messages = connect(state => {
  return { messages: getFilteredMessages(state) };
})(({ messages }) => {
  return (
    <MessagesContainer>
      <Filters />
      <ul style={{ margin: 0, padding: 0 }}>
        {messages.map(msg => <Message {...msg} key={msg.id} />)}
      </ul>
    </MessagesContainer>
  );
});

export { Message };
export default Messages;
