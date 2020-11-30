import React from "react";
import {ThemeWrapper} from "../src/theme/ThemeWrapper";

export const decorators = [
  (Story) => (
      <ThemeWrapper>
        <Story />
      </ThemeWrapper>
  ),
];