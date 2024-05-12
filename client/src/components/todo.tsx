import { useState } from "react";
import {
  Form,
  Col,
  Card,
  Button,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import { Input } from "./input";

type Props = {
  type: "Add" | "Update";
  closeModal: () => void;
  addTodo: (formData: {
    title: string;
    description?: string;
    status: "todo" | "in-progress" | "done";
  }) => Promise<void>;
  updateTodo: (
    id: string,
    formData: {
      title: string;
      description?: string;
      status: "todo" | "in-progress" | "done";
    },
  ) => Promise<void>;
  selectedTodo?: {
    _id: string;
    title: string;
    description?: string;
    status: "todo" | "in-progress" | "done";
  };
};

const statusMapToTitle = {
  todo: "To Do",
  "in-progress": "In Progress",
  done: "Done",
};

const statusMapToVariant = {
  todo: "secondary",
  "in-progress": "info",
  done: "success",
};

const Todo = ({
  type,
  closeModal,
  addTodo,
  updateTodo,
  selectedTodo,
}: Props) => {
  const [formData, setFormData] = useState<{
    title: string;
    description?: string;
    status: "todo" | "in-progress" | "done";
  }>({
    title: selectedTodo ? selectedTodo.title : "",
    description: selectedTodo ? selectedTodo.description : "",
    status: selectedTodo ? selectedTodo.status : "todo",
  });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    return setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (type === "Add") {
        await addTodo(formData);
      } else if (type === "Update" && selectedTodo) {
        await updateTodo(selectedTodo._id, formData);
      }
      closeModal();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Card className="todo-form p-4">
      <Card.Body>
        <Card.Title>
          {type === "Update" ? "Update the Todo" : "Add new Todo"}
        </Card.Title>
        <Form>
          <Form.Row>
            <Col xs={12}>
              <Input
                label="Title"
                name="title"
                value={formData.title}
                onChange={(e) => onChange(e)}
                required
              />
            </Col>
          </Form.Row>
          <Form.Row>
            <Col xs={12}>
              <Input
                label="Description"
                name="description"
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => onChange(e)}
              />
            </Col>
          </Form.Row>
          <Form.Row>
            <Col xs={6}>
              <DropdownButton
                onSelect={(eventKey) => {
                  if (eventKey) {
                    // @ts-expect-error
                    setFormData((x) => ({ ...x, status: eventKey }));
                  }
                }}
                title={statusMapToTitle[formData.status]}
                variant={statusMapToVariant[formData.status]}
              >
                {Object.keys(statusMapToVariant).map((status) => (
                  <Dropdown.Item
                    key={status}
                    eventKey={status}
                    active={formData.status === status}
                  >
                    {statusMapToTitle[status]}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            </Col>
            <Col xs={6} style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="primary"
                onClick={(e) => onSubmit(e)}
                color="white"
                type="submit"
                disabled={loading}
              >
                {type === "Update" ? "Update" : "Add"}
              </Button>
            </Col>
          </Form.Row>
        </Form>
      </Card.Body>
    </Card>
  );
};

export { Todo };
