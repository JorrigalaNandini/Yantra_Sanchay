import { useState } from "react";
import { useNavigate } from "react-router-dom";

function FarmerLogin() {
  const navigate = useNavigate();

  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Farmer login submitted");

    // Authentication will be connected later
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <button
          type="button"
          className="back-button"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </button>

        <div className="login-icon">
          👨‍🌾
        </div>

        <h1>Farmer Login</h1>

        <p>
          Welcome back! Access agricultural machinery
          and services.
        </p>

        <form onSubmit={handleSubmit}>

          <label htmlFor="mobile">
            Mobile Number
          </label>

          <input
            id="mobile"
            type="tel"
            placeholder="Enter your mobile number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
          />

          <label htmlFor="password">
            Password
          </label>

          <input
            id="password"
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
            Login →
          </button>

        </form>

        <div className="login-divider">
          <span>OR</span>
        </div>

        <button
          type="button"
          className="back-role-button"
          onClick={() => navigate("/")}
        >
          Choose another role
        </button>

      </div>

    </div>
  );
}

export default FarmerLogin;