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
            expect(execCommandSpy).toHaveBeenCalledWith("gem", ["uninstall", "cocoapods", expect.any(String), expect.any(String), expect.any(String)]);
            expect(execCommandSpy).toHaveBeenCalledWith("gem", ["install", "cocoapods", expect.any(String), expect.any(String), expect.any(String)]);
        });

        it("version has already installed", async () => {
            CocoapodsInstaller["getInstalledVersion"] = jest.fn().mockReturnValue("1.9.1");
            await CocoapodsInstaller.install("1.9.1");
            expect(execCommandSpy).toHaveBeenCalledTimes(0);
        });
    });
});