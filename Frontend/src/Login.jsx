function Login() {
  return (
    <>
      <div className="flex justify-center align-middle h-screen w-screen flex-col ">
        <h1>Login To NoteCraft</h1>
        <a href="http://localhost:10000/auth/google">
        <button className="bg-white px-3 py-2 text-black font-semibold">
          Continue With Google
        </button></a>
        <a href="http://localhost:10000/auth/github">
        <button className="bg-white px-3 py-2 text-black font-semibold">
          Continue With Github
        </button></a>
      </div>
    </>
  );
}

export default Login;
