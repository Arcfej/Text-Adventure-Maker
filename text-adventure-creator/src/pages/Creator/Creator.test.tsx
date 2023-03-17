import React from "react";
import {render} from "@testing-library/react";
import {BrowserRouter} from "react-router-dom";
import Creator from "./Creator";

describe("Creator", () => {
  it("renders", () => {
      render(
          <BrowserRouter>
              <Creator />
          </BrowserRouter>
      );
  });
});
