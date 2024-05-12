import axios, { isAxiosError } from "axios";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Container,
  Modal,
  Dropdown,
  DropdownButton,
  Row,
  Col,
} from "react-bootstrap";
import { useAuth, useCheckLogin } from "../context/auth";
import { Table } from "../components/table";
import { Todo } from "../components/todo";
import { AppRoutes } from "../config/routes";

const columns = [
  {
    title: "Todo",
    fieldName: "title",
    className: "col-xs-2",
  },
  {
    title: "Created",
    fieldName: "date",
    className: "col-xs-3",
  },

  {
    title: "Actions",
    fieldName: "icon",
    icons: ["Edit", "Check", "TrashAlt"],
    className: "col-xs-3",
  },
];

const statusMapToTitle = {
  all: "Show All",
  todo: "To Do",
  "in-progress": "In Progress",
  done: "Done",
};

const statusMapToVariant = {
  all: "primary",
  todo: "secondary",
  "in-progress": "info",
  done: "success",
};

const Page = () => {
  useCheckLogin({ redirectIfNotLoggedIn: AppRoutes.login.path });
  const { isAuthenticated, logoutUser } = useAuth();

  const [todos, setTodos] = useState<
    {
      _id: string;
      user: string;
      title: string;
      description?: string;
      status: "todo" | "in-progress" | "done";
      date: string;
    }[]
  >([]);
  const [filters, setFilters] = useState<{
    status: "todo" | "in-progress" | "done" | "all";
  }>({
    status: "all",
  });
  const [selectedTodo, setSelectedTodo] = useState<(typeof todos)[number]>();
  const [modal, setModal] = useState({
    isOpen: false,
    type: "",
  });

  const fetchTodos = useCallback(async () => {
    try {
      const res = await axios.get("/api/todos");
      setTodos(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch todos");
    }
  }, []);

  const addTodo = useCallback(
    async (formData: {
      title: string;
      description?: string;
      status: "todo" | "in-progress" | "done";
    }) => {
      try {
        const resp = await axios.post("/api/todos", formData);
        setTodos((todos) => [resp.data, ...todos]);
        toast.success("Todo added successfully");
      } catch (err) {
        if (isAxiosError(err)) {
          const errors = err.response?.data.errors;
          if (errors) {
            errors.forEach((error: { msg: string }) => toast.error(error.msg));
          }
        }
        throw err;
      }
    },
    [],
  );

  const updateTodo = useCallback(
    async (
      id: string,
      formData: {
        title?: string;
        description?: string;
        status?: "todo" | "in-progress" | "done";
      },
    ) => {
      try {
        await axios.patch(`/api/todos/${id}`, formData);
        setTodos((todos) => {
          const cpy = todos.slice();
          const idx = cpy.findIndex((todo) => todo._id === id);
          if (idx > -1) {
            if (formData.title != null) cpy[idx].title = formData.title;
            if (formData.description != null)
              cpy[idx].description = formData.description;
            if (formData.status != null) cpy[idx].status = formData.status;
          }
          return cpy;
        });
        toast.success("Todo updated successfully");
      } catch (err) {
        if (isAxiosError(err)) {
          const errors = err.response?.data.errors;
          if (errors) {
            errors.forEach((error: { msg: string }) => toast.error(error.msg));
          }
        }
        throw err;
      }
    },
    [],
  );

  const deleteTodo = useCallback(async (id: string) => {
    try {
      await axios.delete(`/api/todos/${id}`);
      setTodos((todos) => todos.filter((todo) => todo._id !== id));
      toast.success("Todo deleted successfully");
    } catch (err) {
      if (isAxiosError(err)) {
        const errors = err.response?.data.errors;
        if (errors) {
          errors.forEach((error: { msg: string }) => toast.error(error.msg));
        }
      }
    }
  }, []);

  const openModal = (type: "Add" | "Update", id?: string) => (e) => {
    e.preventDefault();
    setModal({
      isOpen: true,
      type,
    });
  };

  const closeModal = () => {
    setModal({ isOpen: false, type: "" });
  };

  const handleIconClick = (e, icon, id) => {
    switch (icon) {
      case "Check":
        updateTodo(id, { status: "done" }).catch(console.log);
        break;
      case "Edit":
        setSelectedTodo(todos.find((todo) => todo._id === id));
        openModal("Update", id)(e);
        break;
      case "TrashAlt":
        deleteTodo(id);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTodos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const filteredTodos = todos.filter(
    (todo) => filters.status === "all" || todo.status === filters.status,
  );

  return (
    <Container style={{ padding: "25px" }}>
      <Modal show={modal.isOpen} onHide={closeModal} centered>
        {modal.type === "Add" && (
          <Todo
            type="Add"
            closeModal={closeModal}
            addTodo={addTodo}
            updateTodo={updateTodo}
          />
        )}
        {modal.type === "Update" && (
          <Todo
            type="Update"
            closeModal={closeModal}
            addTodo={addTodo}
            updateTodo={updateTodo}
            selectedTodo={selectedTodo}
          />
        )}
      </Modal>

      <h1 className="large text-primary">Dashboard</h1>

      <Row className="my-4">
        <Col>
          <DropdownButton
            onSelect={(eventKey) => {
              if (eventKey) {
                // @ts-expect-error
                setFilters((x) => ({ ...x, status: eventKey }));
              }
            }}
            title={statusMapToTitle[filters.status]}
            variant={statusMapToVariant[filters.status]}
          >
            {Object.keys(statusMapToVariant).map((status) => (
              <Dropdown.Item
                key={status}
                eventKey={status}
                active={filters.status === status}
              >
                {statusMapToTitle[status]}
              </Dropdown.Item>
            ))}
          </DropdownButton>
        </Col>
        <Col
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-start",
          }}
        >
          <Button
            variant="primary"
            className="mr-2"
            onClick={openModal("Add")}
            color="white"
          >
            Add
          </Button>
          <Button variant="danger" onClick={logoutUser} color="white">
            Logout
          </Button>
        </Col>
      </Row>
      <Table
        data={filteredTodos}
        columns={columns}
        iconClick={(e, icon, id) => handleIconClick(e, icon, id)}
      />
      {filteredTodos.length === 0 && filters.status === "all" && (
        <p>You don't have any todo. Click the button to add a todo!</p>
      )}
      {filteredTodos.length === 0 && filters.status !== "all" && (
        <p>Nothing to show here</p>
      )}
    </Container>
  );
};

export default Page;
