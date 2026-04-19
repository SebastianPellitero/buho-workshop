import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "../Button";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
  });

  it("is enabled by default", () => {
    render(<Button>Go</Button>);
    expect(screen.getByRole("button")).toBeEnabled();
  });

  it("is disabled when disabled prop is passed", () => {
    render(<Button disabled>Go</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("is disabled and shows spinner when loading", () => {
    render(<Button loading>Pay</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
    // spinner is a span inside the button
    expect(btn.querySelector("span")).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const handler = jest.fn();
    render(<Button onClick={handler}>Submit</Button>);
    await user.click(screen.getByRole("button"));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", async () => {
    const user = userEvent.setup();
    const handler = jest.fn();
    render(<Button disabled onClick={handler}>Submit</Button>);
    await user.click(screen.getByRole("button"));
    expect(handler).not.toHaveBeenCalled();
  });

  it("forwards additional className", () => {
    render(<Button className="custom-class">X</Button>);
    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });
});
