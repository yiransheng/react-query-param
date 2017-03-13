export const initialState = {
  view: {
    home: true
  },
  entities: {
    topic: {
      "1": "topic-1",
      "2": "topic-2",
      "3": "topic-3"
    }
  }
};

export default function reducer(state = initialState, action) {
  let view;
  switch (action.type) {
    case "NOT_FOUND":
      view = {
        notFound: true
      }
      return { ...state, view };
    case "VIEW_HOME":
      view = {
        home: true
      };
      return { ...state, view };
    case "VIEW_ABOUT":
      view = {
        about: true
      };
      return { ...state, view };
    case "VIEW_TOPICS":
      view = {
        topics: true
      };
      return { ...state, view };
    case "VIEW_TOPIC":
      const { id } = action.payload;
      const topic = state.entities.topic[id];
      view = topic
        ? {
            topic: id
          }
        : {
            notFound: true
          };
      return { ...state, view };
    default:
      return state;
  }
}
