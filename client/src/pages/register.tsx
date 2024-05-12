import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Container, Form } from "react-bootstrap";
import { useAuth, useCheckLogin } from "../context/auth";
import { Input } from "../components/input";
import { AppRoutes } from "../config/routes";

const Page = () => {
  useCheckLogin({ redirectOnLogin: AppRoutes.dashboard.path });

  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const { name, email, password, password2 } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      toast.error("Passwords do not match");
    } else {
      registerUser(name, email, password)
        .then(() => {
          navigate(AppRoutes.dashboard.path);
        })
        .catch(console.log);
    }
  };

  return (
    <Container style={{ padding: "25px" }}>
      <h1 className="large text-primary">Create Your Account</h1>
      <Form>
        <Input
          label="Name"
          id="register-name"
          type="text"
          value={name}
          name="name"
          onChange={(e) => onChange(e)}
          placeholder="Name"
        />
        <Input
          label="Email"
          id="register-email"
          type="email"
          value={email}
          name="email"
          onChange={(e) => onChange(e)}
          placeholder="Email Address"
          required
        />

        <Input
          label="Password"
          id="register-password"
          type="password"
          value={password}
          name="password"
          onChange={(e) => onChange(e)}
          placeholder="Create a password"
        />
        <Input
          label="Confirm you password"
          id="register-password-2"
          type="password"
          value={password2}
          name="password2"
          onChange={(e) => onChange(e)}
          placeholder="Confirm Password"
        />
        <Button
          variant="primary"
          onClick={(e) => onSubmit(e)}
          color="white"
          type="submit"
          className="float-right"
        >
          Register
        </Button>
      </Form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </Container>
  );
};

export default Page;
