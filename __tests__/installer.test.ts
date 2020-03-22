import * as path from "path";
import * as exec from "@actions/exec";
import { CocoapodsInstaller } from "../src/installer";

jest.mock("@actions/exec");

describe("CocoapodsInstaller", () => {
    describe("install", () => {
        let execCommandSpy: jest.SpyInstance;

        beforeEach(() => {
            execCommandSpy = jest.spyOn(exec, "exec");
        });

        afterEach(() => {
            jest.resetAllMocks();
            jest.clearAllMocks();
        });

        it("replace existing version", async () => {
            CocoapodsInstaller["getInstalledVersion"] = jest.fn().mockReturnValue("1.8.5");
            await CocoapodsInstaller.install("1.9.1");
            expect(execCommandSpy).toHaveBeenCalledWith("gem", ["uninstall", "cocoapods", expect.any(String), expect.any(String)]);
            expect(execCommandSpy).toHaveBeenCalledWith("gem", ["install", "cocoapods", expect.any(String), expect.any(String), expect.any(String)]);
        });

        it("version has already installed", async () => {
            CocoapodsInstaller["getInstalledVersion"] = jest.fn().mockReturnValue("1.9.1");
            await CocoapodsInstaller.install("1.9.1");
            expect(execCommandSpy).toHaveBeenCalledTimes(0);
        });
    });

    describe("getVersionFromPodfile", () => {
        it.each([
            ["Podfile.lock", "1.5.3"],
            ["Podfile2.lock", "1.3.1"],
            ["Podfile3.lock", "1.7.0"],
            ["Podfile4.lock", null]
        ])("test case %#", (input: string, expected: string | null) => {
            const testCasePath = path.resolve(path.join(__dirname, "podfile-example", input));
            if (expected) {
                expect(CocoapodsInstaller.getVersionFromPodfile(testCasePath)).toBe(expected);
            } else {
                expect(() => CocoapodsInstaller.getVersionFromPodfile(testCasePath)).toThrow();
            }
        });
    });
});