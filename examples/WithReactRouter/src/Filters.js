import React from "react";
import { connect } from "react-redux";

import Toggle from "react-toggle";
import { QueryParam } from "react-url-param";

import { filterUnread } from "./ducks";

const Filters = connect(
  ({ view }) => {
    return { ...view.filter, userId: view.whoami };
  },
  { filterUnread }
)(({ filterUnread, search, unread, sender, userId }) => {
  return (
    <QueryParam name="user" values={userId}>
      <span>
        Unread: <Toggle
          defaultChecked={unread}
          onChange={() => {
            filterUnread(!unread);
          }}
        />
      </span>
      <QueryParam
        name="unread"
        values={unread === null ? [] : Number(unread)}
      />
      <QueryParam name="search" values={unread === null ? [] : search} />
    </QueryParam>
  );
});

export default Filters;
