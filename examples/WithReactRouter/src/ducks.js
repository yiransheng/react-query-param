import { sortBy, isEmpty, isFinite, random, mapValues } from "lodash";
import { createSelector } from "reselect";
import { liftReducer } from "react-url-param/react-router-redux";
import { routerReducer, LOCATION_CHANGE } from "react-router-redux";
import { parse } from "query-string";
import casual from "casual-browserify";

// fake data for store

export function getInitialState(history = { location: null }) {
  return {
    entities: {
      message: {
        "1": {
          id: 1,
          date: new Date(Date.now() - random(1000, 4 * 3600 * 1000)),
          unread: Math.random() > 0.5,
          title: casual.title,
          body: casual.text,
          toUser: 1,
          fromUser: 2
        },
        "2": {
          id: 2,
          date: new Date(Date.now() - random(1000, 4 * 3600 * 1000)),
          unread: Math.random() > 0.5,
          title: casual.title,
          body: casual.text,
          toUser: 1,
          fromUser: 2
        },
        "3": {
          id: 3,
          date: new Date(Date.now() - random(1000, 4 * 3600 * 1000)),
          unread: Math.random() > 0.5,
          title: casual.title,
          body: casual.text,
          toUser: 1,
          fromUser: 3
        }
      },
      person: {
        "1": {
          id: 1,
          name: casual.name
        },
        "2": {
          id: 2,
          name: casual.name
        },
        "3": {
          id: 3,
          name: casual.name
        }
      }
    },

    view: {
      whoami: 1,
      filter: {
        unread: null,
        search: null,
        sender: null
      }
    },

    router: routerReducer(undefined, {
      type: LOCATION_CHANGE,
      payload: history.location
    })
  };
}

// actions and action creators
//
export const CLEAR_FILTER = "CLEAR_FILTER";
export const SET_FILTER = "SET_FILTER";
export const SWITCH_USER = "SWITCH_USER";

export function filterUnread(unread) {
  const type = unread ? SET_FILTER : CLEAR_FILTER;
  return { type: type, payload: { unread } };
}
export function filterSearched(search) {
  const type = search ? SET_FILTER : CLEAR_FILTER;
  return { type: type, payload: { search } };
}

export function deriveQueryActions(location) {
  const query = parse(location.search);
  if (!query || isEmpty(query)) {
    return [];
  }
  const filter = {};
  const boolMapping = { "0": null, "1": true };
  if ("unread" in query && query.unread in boolMapping) {
    filter.unread = boolMapping[query.unread];
  } else {
    filter.unread = null;
  }
  if ("search" in query) {
    filter.search = query.search || "";
  } else {
    filter.search = null;
  }
  if ("sender" in query) {
    const senders = Array.isArray(query.sender) ? query.sender : [query.sender];
    filter.sender = senders.map(id => parseInt(id, 10)).filter(isFinite);
  } else {
    filter.sender = null;
  }
  return [
    { type: SET_FILTER, payload: filter },
    { type: SWITCH_USER, payload: query.user }
  ];
}

// reducers

function filterReducer(filterSettings, { type, payload }) {
  switch (type) {
    case CLEAR_FILTER:
      return filterReducer(filterSettings, {
        type: SET_FILTER,
        payload: mapValues(payload, () => null)
      });
    case SET_FILTER:
      const newState = { ...filterSettings, ...payload };
      if (Array.isArray(newState.sender) && !newState.sender.length) {
        newState.sender = null;
      }
      if (!newState.search) {
        newState.search = null;
      }
      return newState;
    default:
      return filterSettings;
  }
}

const rootReducer = liftReducer(function (state, action) {
  if (action.type === SWITCH_USER) {
    const view = { ...state.view, whoami: action.payload || state.view.whoami };
    return {
      ...state,
      view
    };
  }
  if ([SET_FILTER, CLEAR_FILTER].includes(action.type)) {
    const filter = filterReducer(state.view.filter, action);
    return {
      ...state,
      view: {
        ...state.view,
        filter
      }
    };
  }
  return state;
}, deriveQueryActions);

// selectors

export function getCurrentUser({ entities, view }) {
  return entities.person[view.whoami];
}
export function getUser({ entities }, ownProps) {
  return entities.person[ownProps.userId];
}
export const getOtherUsers = createSelector(
  [getCurrentUser, ({ entities }) => entities.person],
  (currentUser, people) => {
    return Object.keys(people)
      .filter(id => parseInt(id, 10) !== currentUser.id)
      .map(id => people[id]);
  }
);
export const getMessages = createSelector(
  [({ view }) => view.whoami, ({ entities }) => entities.message],
  (userId, messages) => {
    const userMessages = Object.keys(messages)
      .map(id => {
        return messages[id];
      })
      .filter(message => {
        return (message.toUser = userId);
      });
    return sortBy(userMessages, ({ date }) => -date);
  }
);
export const getFilteredMessages = createSelector(
  [getMessages, ({ view }) => view.filter],
  (messages, filter) => {
    const byUnread = message => {
      if (filter.unread !== null) {
        return message.unread === filter.unread;
      }
      return true;
    };
    const bySearch = message => {
      if (filter.search !== null) {
        const words = filter.search.split(/\s+/g);
        return words.some(word => {
          if (!word) {
            return false;
          }
          const regex = new RegExp(word, "ig");
          return regex.test(message.title) || regex.test(message.body);
        });
      }
      return true;
    };
    const bySender = message => {
      if (filter.sender !== null) {
        return filter.sender.includes(message.fromUser);
      }
      return true;
    };

    return messages.filter(message => {
      return byUnread(message) && bySearch(message) && bySender(message);
    });
  }
);

// default

export default rootReducer;
