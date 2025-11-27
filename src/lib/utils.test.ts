import { describe, expect, it } from "vitest"

import { cn } from "./utils"

describe("cn", () => {
  it("merges strings and conditional classes", () => {
    const result = cn("base", ["p-2"], { hidden: false, flex: true })

    expect(result).toContain("base")
    expect(result).toContain("p-2")
    expect(result).toContain("flex")
    expect(result).not.toContain("hidden")
  })
})
