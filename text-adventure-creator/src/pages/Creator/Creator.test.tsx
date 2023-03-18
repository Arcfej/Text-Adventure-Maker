import React from "react";
import {render} from "@testing-library/react";
import Creator from "./Creator";

jest.mock('react-router', () => ({
    useNavigate: () => jest.fn(),
}));

describe("Creator", () => {
  it("renders", () => {
      render(
          <Creator />
      );
  });
});
