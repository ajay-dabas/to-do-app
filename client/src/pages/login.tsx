import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";
import { useAuth, useCheckLogin } from "../context/auth";
import { Input } from "../components/input";
import { AppRoutes } from "../config/routes";

const Login = () => {
  useCheckLogin({ redirectOnLogin: AppRoutes.dashboard.path });
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    loginUser(email, password)
      .then(() => {
        navigate(AppRoutes.dashboard.path);
      })
      .catch(console.log);
  };

  return (
    <Container style={{ padding: "25px" }}>
      <h1 className="large text-primary">Sign Into Your Account</h1>
      <Form>
        <Input
          label="Email"
          id="login-email"
          type="email"
          value={email}
          name="email"
          onChange={(e) => onChange(e)}
          placeholder="Email Address"
          required
        />
        <Input
          label="Password"
          id="login-password"
          type="password"
          value={password}
          name="password"
          onChange={(e) => onChange(e)}
          placeholder="Enter your password"
        />
        <Button
          variant="primary"
          onClick={(e) => onSubmit(e)}
          color="white"
          type="submit"
          className="float-right"
        >
          Login
        </Button>
      </Form>

      <p className="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </Container>
  );
};

export default Login;
