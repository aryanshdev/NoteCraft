import ErrorNote from "./ErrorNote";

function Display500() {
  return (
    <ErrorNote code="500" title="Server dozed off" to="/" action="Back to home" color="red">
      Something broke on our side. Give it a minute and try again.
    </ErrorNote>
  );
}

export default Display500;
