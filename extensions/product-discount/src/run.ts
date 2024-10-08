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
  function getValidDiscountValue(
    discountValue: string,
    maxDiscount: number
  ): string {
    const discountParts = discountValue.split("_");
    const discount =
      discountParts.length > 1 ? discountParts[1] : discountValue;

    const parsedDiscount = parseFloat(discount || "0");
    return parsedDiscount <= maxDiscount
      ? String(parsedDiscount.toFixed(2))
      : "0";
  }

  const discountValue = getValidDiscountValue(
    input.cart?.discountValue?.value || "0",
    MAX_DISCOUNT
  );

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
            value: discountValue,
          },
        },
      },
    ],
    discountApplicationStrategy: DiscountApplicationStrategy.First,
  };
}
