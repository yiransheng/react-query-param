import React from "react";
import { connect } from "react-redux";
import { styled } from "styletron-react";

import Flex from "./Flex";
import Toggle from "react-toggle";
import { QueryParam } from "react-url-param";

import { filterUnread, filterSearched } from "./ducks";

const Cell = styled("span", ({ bold }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0.25rem",
  fontWeight: bold ? 700 : 400
}));
const FiltersContainer = styled("div", () => ({
  marginTop: "1rem",
  borderBottom: "2px solid #ccc",
  borderTop: "1px solid #ccc",
  padding: "0.5rem",
  paddingTop: "1.3rem"
}));

const Filters = connect(
  ({ view }) => {
    return { ...view.filter, userId: view.whoami };
  },
  { filterUnread, filterSearched }
)(({ filterUnread, filterSearched, search, unread, sender, userId }) => {
  return (
    <FiltersContainer>
      <Flex>
        <Cell bold>
          Show Unread Only:
        </Cell>
        <Cell>
          <Toggle
            defaultChecked={unread}
            onChange={() => {
              filterUnread(!unread);
            }}
          />
        </Cell>
        <Cell bold>
          Search Messages:{" "}
        </Cell>
        <Cell>
          <input
            value={search || ""}
            onChange={e => {
              filterSearched(e.target.value);
            }}
          />
        </Cell>
      </Flex>
      <QueryParam
        name="unread"
        values={unread === null ? [] : Number(unread)}
      />
      <QueryParam name="search" values={search === null ? [] : search} />
    </FiltersContainer>
  );
});

export default Filters;
