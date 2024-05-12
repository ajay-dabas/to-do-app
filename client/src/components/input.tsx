import type { ReactNode } from "react";
import type { FormControlProps, FormProps } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

type Props = FormProps &
  FormControlProps & {
    name?: string;
    placeholder?: string;
    required?: boolean;
    label?: ReactNode;
    rows?: number;
  };

function Input({ label, children, ...rest }: Props) {
  return (
    <Form.Group>
      <Form.Label>{label}</Form.Label>
      <InputGroup>
        <Form.Control {...rest}>{children}</Form.Control>
      </InputGroup>
    </Form.Group>
  );
}

export { Input };
