import { useState } from "react";
import { useNavigate } from "react-router-dom";

function OfficerLogin() {

  const navigate = useNavigate();

  const [officerId, setOfficerId] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({
      role: "officer",
      officerId,
      password
    });

    // Dashboard will be connected later
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <button
          className="back-button"
          onClick={() => navigate("/")}
        >
          ← Back
        </button>

        <div className="login-icon">
          👮
        </div>

        <h1>Officer Login</h1>

        <p>
          Manage and monitor Yantra Sanchay
        </p>

        <form onSubmit={handleSubmit}>

          <label>
            Officer ID
          </label>

          <input
            type="text"
            placeholder="Enter officer ID"
            value={officerId}
            onChange={(e) => setOfficerId(e.target.value)}
            required
          />

          <label>
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="login-button"
          >
            Login
          </button>

        </form>

      </div>

    </div>
  );
}

export default OfficerLogin;