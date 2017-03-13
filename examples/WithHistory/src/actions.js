export function navigate(link) {
  switch (link.route) {
    case "home":
      return { type: "VIEW_HOME" };
    case "about":
      return { type: "VIEW_ABOUT" };
    case "topics":
      return { type: "VIEW_TOPICS" };
    case "topic":
      return { type: "VIEW_TOPIC", payload: { id: link.id } };
    default:
      return { type: "NOT_FOUND" };
  }
}
