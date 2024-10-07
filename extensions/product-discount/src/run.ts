// @ts-check
import {
  DiscountApplicationStrategy,
  RunInput,
  FunctionRunResult,
} from "../generated/api";

const EMPTY_DISCOUNT: FunctionRunResult = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

export function run(input: RunInput): FunctionRunResult {
  const discountValue = input.cart.discountValue?.value || "0";

  const targets = input.cart.lines

    .filter((line) => line.quantity >= 1)
    .map((line) => {
      console.log("line", JSON.stringify(line));
      return /** @type {Target} */ {
        cartLine: {
          id: line.id,
        },
      };
    });
  if (!targets.length) {
    console.error("No cart lines qualify for volume discount.");
    return EMPTY_DISCOUNT;
  }

  return {
    discounts: [
      {
        targets,

        value: {
          percentage: {
            value: discountValue,
          },
        },
      },
    ],
    discountApplicationStrategy: DiscountApplicationStrategy.First,
  };
}
