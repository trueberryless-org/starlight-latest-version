import { SEMVER_PATTERN } from "../consts/semantic.version.pattern";

const extractVersion = (tagName: string) => {
  const match = tagName.match(SEMVER_PATTERN);
  return match?.groups?.version || null;
};

const extractPrerelease = (tagName: string) => {
  const match = tagName.match(SEMVER_PATTERN);
  return match?.groups?.prerelease || null;
};

describe("Version Extraction from tagName", () => {
  // Expanded valid cases with more complex scenarios
  const validCases = [
    // Basic versions
    { 
      input: "1.2.3", 
      expectedVersion: "1.2.3",
      expectedPrerelease: null 
    },
    { 
      input: "10.20.30", 
      expectedVersion: "10.20.30",
      expectedPrerelease: null 
    },
    { 
      input: "0.0.1", 
      expectedVersion: "0.0.1",
      expectedPrerelease: null 
    },
    
    // Versions with 'v' prefix
    { 
      input: "v1.2.3", 
      expectedVersion: "1.2.3",
      expectedPrerelease: null 
    },
    
    // Versions with namespaces/prefixes
    { 
      input: "release@1.2.3", 
      expectedVersion: "1.2.3",
      expectedPrerelease: null 
    },
    { 
      input: "name@v1.2.3", 
      expectedVersion: "1.2.3",
      expectedPrerelease: null 
    },
    { 
      input: "package-name@1.2.3", 
      expectedVersion: "1.2.3",
      expectedPrerelease: null 
    },
    { 
      input: "feature/branch@1.2.3", 
      expectedVersion: "1.2.3",
      expectedPrerelease: null 
    },
    
    // Versions with prerelease identifiers
    { 
      input: "1.2.3-rc.1", 
      expectedVersion: "1.2.3",
      expectedPrerelease: "rc.1" 
    },
    { 
      input: "name@1.2.3-beta.2", 
      expectedVersion: "1.2.3",
      expectedPrerelease: "beta.2" 
    },
    { 
      input: "v1.2.3-alpha.34", 
      expectedVersion: "1.2.3",
      expectedPrerelease: "alpha.34" 
    },
    { 
      input: "package-name@1.2.3-rc.1", 
      expectedVersion: "1.2.3",
      expectedPrerelease: "rc.1" 
    },
    
    // More complex prerelease scenarios
    { 
      input: "1.2.3-alpha", 
      expectedVersion: "1.2.3",
      expectedPrerelease: "alpha" 
    },
    { 
      input: "1.2.3-beta", 
      expectedVersion: "1.2.3",
      expectedPrerelease: "beta" 
    },
    { 
      input: "1.2.3-rc", 
      expectedVersion: "1.2.3",
      expectedPrerelease: "rc" 
    },
    { 
      input: "1.2.3-feature.test", 
      expectedVersion: "1.2.3",
      expectedPrerelease: "feature.test" 
    },
    { 
      input: "1.2.3-long.complex.prerelease.tag", 
      expectedVersion: "1.2.3",
      expectedPrerelease: "long.complex.prerelease.tag" 
    }
  ];

  // Expanded invalid cases with more scenarios
  const invalidCases = [
    // Incomplete versions
    { 
      input: "1.2", 
      expectedVersion: null,
      expectedPrerelease: null 
    },
    { 
      input: "v1.2", 
      expectedVersion: null,
      expectedPrerelease: null 
    },
    { 
      input: "1.2.", 
      expectedVersion: null,
      expectedPrerelease: null 
    },
    { 
      input: "v1.2.", 
      expectedVersion: null,
      expectedPrerelease: null 
    },
    
    // Too many version segments
    { 
      input: "1.2.3.4", 
      expectedVersion: null,
      expectedPrerelease: null 
    },
    { 
      input: "1.2.3.", 
      expectedVersion: null,
      expectedPrerelease: null 
    },
    { 
      input: "v1.2.3.4", 
      expectedVersion: null,
      expectedPrerelease: null 
    },
    
    // Invalid prerelease formats
    { 
      input: "1.2.3-", 
      expectedVersion: null,
      expectedPrerelease: null 
    },
    { 
      input: "1.2.3-.rc", 
      expectedVersion: null,
      expectedPrerelease: null 
    },
    { 
      input: "1.2.3-rc.", 
      expectedVersion: null,
      expectedPrerelease: null 
    },
    { 
      input: "1.2.3--rc", 
      expectedVersion: null,
      expectedPrerelease: null 
    },
    
    // Random text and non-version strings
    { 
      input: "random-text", 
      expectedVersion: null,
      expectedPrerelease: null 
    },
    { 
      input: "", 
      expectedVersion: null,
      expectedPrerelease: null 
    },
    { 
      input: "123", 
      expectedVersion: null,
      expectedPrerelease: null 
    },
    
    // Edge cases with special characters
    { 
      input: "v1.2.3-special!char", 
      expectedVersion: null,
      expectedPrerelease: null 
    },
    { 
      input: "1.2.3-pre release", 
      expectedVersion: null,
      expectedPrerelease: null 
    }
  ];

  // Version extraction tests
  test.each(validCases)(
    "should extract version correctly for valid input: $input",
    ({ input, expectedVersion }) => {
      expect(extractVersion(input)).toBe(expectedVersion);
    }
  );

  // Prerelease extraction tests
  test.each(validCases)(
    "should extract prerelease correctly for valid input: $input",
    ({ input, expectedPrerelease }) => {
      expect(extractPrerelease(input)).toBe(expectedPrerelease);
    }
  );

  // Invalid cases tests for both version and prerelease
  test.each(invalidCases)(
    "should return null for invalid input: $input",
    ({ input, expectedVersion, expectedPrerelease }) => {
      expect(extractVersion(input)).toBe(expectedVersion);
      expect(extractPrerelease(input)).toBe(expectedPrerelease);
    }
  );
});