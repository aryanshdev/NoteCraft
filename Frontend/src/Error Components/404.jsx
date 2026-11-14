import ErrorNote from "./ErrorNote";

function Display404({ fullScreen = false }) {
  return (
    <ErrorNote code="404" title="Not found" to="/" action="Back to home" color="blue" fullScreen={fullScreen}>
      We looked under every sticky note. Whatever you were after isn't here — check the link and try
      again.
    </ErrorNote>
  );
}

export default Display404;
