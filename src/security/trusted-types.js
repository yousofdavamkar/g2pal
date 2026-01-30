import DOMPurify from "dompurify";
import "trusted-types"; // Polyfill

let policy;

if (window.trustedTypes && window.trustedTypes.createPolicy) {
  try {
    policy = window.trustedTypes.createPolicy("default", {
      createHTML: (string) => DOMPurify.sanitize(string),
      createScript: (string) => string, // Be careful with this, usually we want to avoid creating scripts dynamically
      createScriptURL: (string) => string,
    });
  } catch (e) {
    console.warn(
      'Trusted Types policy "default" could not be created (it might already exist).',
      e
    );
    policy = window.trustedTypes.defaultPolicy;
  }
} else {
  // Fallback for browsers without Trusted Types support (or if polyfill fails)
  // We just return the sanitized string, mimicking the policy behavior
  policy = {
    createHTML: (string) => DOMPurify.sanitize(string),
    createScript: (string) => string,
    createScriptURL: (string) => string,
  };
}

export default policy;
