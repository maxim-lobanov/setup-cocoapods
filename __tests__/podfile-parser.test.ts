import * as path from "path";
import { getVersionFromPodfile, getVersionFromPodfileLine } from "../src/podfile-parser";

describe("getVersionFromPodfile", () => {
    it.each([
        ["Podfile.lock", "1.5.3"],
        ["Podfile2.lock", "1.9.3"],
        ["Podfile3.lock", "1.10.0.rc.1"],
        ["Podfile4.lock", "1.9.0.beta.2"],
        ["Podfile5.lock", null]
    ])("test case %#", (input: string, expected: string | null) => {
        const testCasePath = path.resolve(path.join(__dirname, "podfile-example", input));
        if (expected) {
            expect(getVersionFromPodfile(testCasePath)).toBe(expected);
        } else {
            expect(() => getVersionFromPodfile(testCasePath)).toThrow();
        }
    });
});

describe("getVersionFromPodfileLine", () => {
    it.each([
        ["COCOAPODS: 1.5.3", "1.5.3"],
        ["COCOAPODS: 1.9.1", "1.9.1"],
        ["COCOAPODS: 1.10.0.rc.1", "1.10.0.rc.1"],
        ["COCOAPODS: 1.8.0.beta.2", "1.8.0.beta.2"],
        ["COCOAPODS: 1.7.0.beta.1", "1.7.0.beta.1"],
    ])("%s -> %s", (input: string, expected: string) => {
        const matchedVersion = getVersionFromPodfileLine(input);
        expect(matchedVersion).toBe(expected);
    });
});