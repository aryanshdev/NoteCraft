import ErrorNote from "./ErrorNote";

function Display401() {
  return (
    <ErrorNote code="401" title="Signed out" to="/login" action="Log in again" color="yellow">
      Your session expired. Log back in to keep working on your notes.
    </ErrorNote>
  );
}

export default Display401;
