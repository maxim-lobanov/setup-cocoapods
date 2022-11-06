import * as exec from "@actions/exec";
import * as core from "@actions/core";
import { ExecOptions } from "@actions/exec/lib/interfaces";

export class CocoapodsInstaller {
    public static async install(versionSpec: string): Promise<void> {
        // Checking pre-installed version of Cocoapods
        const installedVersion = await this.getInstalledVersion();
        if (installedVersion === versionSpec) {
            core.info(`Cocoapods ${versionSpec} has already been installed. No need to re-install.`);
            return;
        }

        // Remove pre-installed version of Cocoapods
        exec.exec("gem", ["uninstall", "cocoapods", "--all", "--executables", "--ignore-dependencies"]);

        // Install new version of Cocoapods
        const versionArguments = (versionSpec === "latest") ? [] : ["-v", versionSpec];
        await exec.exec("gem", ["install", "cocoapods", ...versionArguments, "--no-document"]);

        core.info(`Cocoapods ${versionSpec} has been installed successfully`);
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