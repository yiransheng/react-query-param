import React from "react";
import { connect } from "react-redux";
import { styled } from "styletron-react";

import { Link } from "react-router-dom";
import { Message } from "./Messages";
import { getCurrentUser } from "./ducks";

const MessageContainer = styled("div", () => ({
  width: "100%",
  margin: "5rem 1rem 1rem",
  borderTop: "1px solid #ccc",
  borderBottom: "2px solid #ccc",
  backgroundColor: "f6f6f6"
}));

const MessageBody = styled("p", () => ({
  padding: "1rem",
  minHeight: "25rem",
  border: "1px solid #ccc",
  backgroundColor: "#fff"
}));

const MessageDetail = connect((state, ownProps) => {
  const { id } = ownProps;
  const currentUser = getCurrentUser(state);
  const message = state.entities.message[id];
  if (message) {
    return message.toUser == currentUser.id ? message : { notFound: true };
  } else {
    return { notFound: true };
  }
})(props => {
  let content;
  if (props.notFound) {
    content = <h3>Not Found</h3>;
  } else {
    const { body } = props;
    content = [
      <Message {...props} detail />,
      <MessageBody>{body}</MessageBody>,
      <Link to="/">{"< All Messages"}</Link>
    ];
  }

  return (
    <MessageContainer>
      {content}
    </MessageContainer>
  );
});

export default MessageDetail;
