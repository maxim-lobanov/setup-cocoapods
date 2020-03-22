import * as fs from "fs";
import * as path from "path";
import { EOL } from "os";
import * as exec from "@actions/exec";
import * as core from "@actions/core";
import { ExecOptions } from "@actions/exec/lib/interfaces";

export class CocoapodsInstaller {
    public static async install(versionSpec: string): Promise<void> {
        // Checking pre-installed version of Cocoapods
        const installedVersion = await this.getInstalledVersion();
        if (installedVersion === versionSpec) {
            core.info(`Cocoapods ${versionSpec} has already installed. Not needed to re-install.`);
            return;
        }

        // Remove pre-installed version of Cocoapods
        exec.exec("gem", ["uninstall", "cocoapods", "--all", "--executables"]);

        // Install new version of Cocoapods
        const versionArguments = (versionSpec === "latest") ? [] : ["-v", versionSpec];
        await exec.exec("gem", ["install", "cocoapods", ...versionArguments]);

        core.info(`Cocoapods ${versionSpec} has installed successfully`);
    }

    public static getVersionFromPodfile(podfilePath: string): string {
        const absolutePath = path.resolve(podfilePath);

        if (!fs.existsSync(absolutePath)) {
            throw new Error(`podfile is not found on path '${absolutePath}'`);
        }

        const fileContent = fs.readFileSync(absolutePath);
        const fileLines = fileContent.toString().split(EOL);
        return fileLines[0];
    }

    private static async getInstalledVersion(): Promise<string | null> {
        let stdOutput = "";
        const options: ExecOptions = {
            listeners: {
                stdout: (data: Buffer): void => {
                    stdOutput += data.toString();
                }
            }
        };

        const exitCode = await exec.exec("pod", ["--version"], options).catch(error => error);
        if (exitCode === 0 && stdOutput) {
            return stdOutput.trim();
        }

        return null;
    }
}