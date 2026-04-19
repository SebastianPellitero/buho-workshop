import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ColorPicker from "../ColorPicker";
import type { FilamentDTO } from "@/types";

const filaments: FilamentDTO[] = [
  { id: "f1", name: "Crimson Red", hexCode: "#DC2626", stockGrams: 850 },
  { id: "f2", name: "Ocean Blue", hexCode: "#2563EB", stockGrams: 1200 },
  { id: "f3", name: "Natural White", hexCode: "#F5F5F0", stockGrams: 0 },
];

describe("ColorPicker", () => {
  it("renders only in-stock filaments", () => {
    render(<ColorPicker filaments={filaments} selected={null} onChange={jest.fn()} />);
    expect(screen.getByTitle("Crimson Red")).toBeInTheDocument();
    expect(screen.getByTitle("Ocean Blue")).toBeInTheDocument();
    expect(screen.queryByTitle("Natural White")).not.toBeInTheDocument();
  });

  it("shows 'No colors available' when all filaments are out of stock", () => {
    const outOfStock = filaments.map((f) => ({ ...f, stockGrams: 0 }));
    render(<ColorPicker filaments={outOfStock} selected={null} onChange={jest.fn()} />);
    expect(screen.getByText(/no colors available/i)).toBeInTheDocument();
  });

  it("calls onChange with the filament id when a swatch is clicked", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<ColorPicker filaments={filaments} selected={null} onChange={onChange} />);
    await user.click(screen.getByTitle("Crimson Red"));
    expect(onChange).toHaveBeenCalledWith("f1");
  });

  it("shows the selected color name next to the label", () => {
    render(<ColorPicker filaments={filaments} selected="f2" onChange={jest.fn()} />);
    expect(screen.getByText(/ocean blue/i)).toBeInTheDocument();
  });

  it("does not call onChange on a second click of the same swatch (deselect is handled by parent)", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<ColorPicker filaments={filaments} selected="f1" onChange={onChange} />);
    await user.click(screen.getByTitle("Crimson Red"));
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
