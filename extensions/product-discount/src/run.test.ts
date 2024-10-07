import { describe, it, expect } from "vitest";
import { run } from "./run";
import {
  RunInput,
  FunctionRunResult,
  DiscountApplicationStrategy,
} from "../generated/api";

describe("run", () => {
  it("should return an empty discount when there are no qualifying cart lines", () => {
    const input: RunInput = {
      cart: {
        discountValue: { value: "10" },
        lines: [], // No cart lines
      },
    };

    const result: FunctionRunResult = run(input);

    expect(result).toEqual({
      discountApplicationStrategy: DiscountApplicationStrategy.First,
      discounts: [],
    });
  });

  it("should apply discount to qualifying cart lines", () => {
    const input: RunInput = {
      cart: {
        discountValue: { value: "10" },
        lines: [
          { id: "line-1", quantity: 2 }, // A valid line
          { id: "line-2", quantity: 0 }, // Invalid line (quantity < 1)
        ],
      },
    };

    const result: FunctionRunResult = run(input);

    expect(result).toEqual({
      discountApplicationStrategy: DiscountApplicationStrategy.First,
      discounts: [
        {
          targets: [
            {
              cartLine: { id: "line-1" },
            },
          ],
          value: {
            percentage: {
              value: "10",
            },
          },
        },
      ],
    });
  });

  it("should handle cases where discountValue is undefined", () => {
    const input: RunInput = {
      cart: {
        lines: [{ id: "line-1", quantity: 1 }],
      },
    };

    const result: FunctionRunResult = run(input);

    expect(result).toEqual({
      discountApplicationStrategy: DiscountApplicationStrategy.First,
      discounts: [
        {
          targets: [
            {
              cartLine: { id: "line-1" },
            },
          ],
          value: {
            percentage: {
              value: "0", // Default value since discountValue is undefined
            },
          },
        },
      ],
    });
  });
});
