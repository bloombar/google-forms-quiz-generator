import { describe, expect, it } from "vitest";
import * as lib from "../src/index.js";

/**
 * Guards the public library surface (src/index.ts) that in-process consumers
 * such as Slide Machine import. The interactive CLI auth and deployment
 * tracking are intentionally NOT part of this surface.
 */
describe("library barrel (index.ts)", () => {
  it("re-exports the auth-agnostic core functions", () => {
    expect(typeof lib.createGoogleFormFromQuiz).toBe("function");
    expect(typeof lib.updateGoogleFormFromQuiz).toBe("function");
    expect(typeof lib.downloadFormAsQuizFile).toBe("function");
    expect(typeof lib.buildTemplateQuizFile).toBe("function");
    expect(typeof lib.readQuizFile).toBe("function");
    expect(typeof lib.writeQuizFile).toBe("function");
    expect(typeof lib.validateQuizForm).toBe("function");
  });

  it("re-exports the type-layer constants", () => {
    expect(lib.DEFAULT_EMAIL_COLLECTION_MODE).toBe("verified");
    expect(lib.SUPPORTED_TYPES).toContain("single_choice");
    expect(lib.SUPPORTED_EMAIL_COLLECTION_MODES).toContain("verified");
  });

  it("does not leak CLI-only auth or deployment tracking", () => {
    expect("getAuthorizedClient" in lib).toBe(false);
    expect("trackDeployment" in lib).toBe(false);
  });
});
