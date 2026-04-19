import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToastProvider, useToast } from "../Toast";

function Trigger({ message, type }: { message: string; type: "success" | "error" | "info" }) {
  const { showToast } = useToast();
  return <button onClick={() => showToast(message, type)}>Show</button>;
}

function setup(message = "Hello", type: "success" | "error" | "info" = "success") {
  return render(
    <ToastProvider>
      <Trigger message={message} type={type} />
    </ToastProvider>
  );
}

describe("Toast", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.runOnlyPendingTimers() && jest.useRealTimers());

  it("shows a toast message when showToast is called", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    setup("Order confirmed!");
    await user.click(screen.getByRole("button", { name: "Show" }));
    expect(screen.getByText("Order confirmed!")).toBeInTheDocument();
  });

  it("shows error toast with the correct message", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    setup("Payment failed", "error");
    await user.click(screen.getByRole("button", { name: "Show" }));
    expect(screen.getByText("Payment failed")).toBeInTheDocument();
  });

  it("auto-dismisses after 4 seconds", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    setup("Temporary");
    await user.click(screen.getByRole("button", { name: "Show" }));
    expect(screen.getByText("Temporary")).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(4100);
    });

    expect(screen.queryByText("Temporary")).not.toBeInTheDocument();
  });
});
