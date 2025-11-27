import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Button } from "./button"

describe("Button", () => {
  it("renders a button with provided text", () => {
    render(<Button>Click me</Button>)

    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument()
  })

  it("applies variant and size styles", () => {
    render(
      <Button variant="destructive" size="sm">
        Delete
      </Button>
    )

    const button = screen.getByRole("button", { name: /delete/i })

    expect(button.className).toContain("bg-destructive")
    expect(button.className).toContain("h-8")
  })
})
