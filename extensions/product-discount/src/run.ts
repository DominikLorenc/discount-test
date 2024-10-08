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

const MAX_DISCOUNT = 30;

export function run(input: RunInput): FunctionRunResult {
  let discountValue = parseFloat(input.cart.discountValue?.value || "0");
  if (discountValue > MAX_DISCOUNT) {
    discountValue = MAX_DISCOUNT;
  }

  const targets = input.cart.lines
    .filter((line) => line.quantity >= 1)
    .map((line) => {
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
            value: discountValue.toFixed(2),
          },
        },
      },
    ],
    discountApplicationStrategy: DiscountApplicationStrategy.First,
  };
}
