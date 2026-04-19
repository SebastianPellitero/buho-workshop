import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SizeSelector from "../SizeSelector";
import type { Size } from "@/types";

const sizes: Size[] = ["S", "M", "L"];

describe("SizeSelector", () => {
  it("renders all provided sizes", () => {
    render(<SizeSelector sizes={sizes} selected={null} onChange={jest.fn()} />);
    expect(screen.getByRole("button", { name: "S" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "M" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "L" })).toBeInTheDocument();
  });

  it("shows the selected size label when a size is selected", () => {
    render(<SizeSelector sizes={sizes} selected="M" onChange={jest.fn()} />);
    expect(screen.getByText(/medium/i)).toBeInTheDocument();
  });

  it("does not show a label when nothing is selected", () => {
    render(<SizeSelector sizes={sizes} selected={null} onChange={jest.fn()} />);
    expect(screen.queryByText(/small|medium|large/i)).not.toBeInTheDocument();
  });

  it("calls onChange with the correct size", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<SizeSelector sizes={sizes} selected={null} onChange={onChange} />);
    await user.click(screen.getByRole("button", { name: "L" }));
    expect(onChange).toHaveBeenCalledWith("L");
  });

  it("renders a subset of sizes", () => {
    render(<SizeSelector sizes={["S", "M"]} selected={null} onChange={jest.fn()} />);
    expect(screen.queryByRole("button", { name: "L" })).not.toBeInTheDocument();
  });
});
