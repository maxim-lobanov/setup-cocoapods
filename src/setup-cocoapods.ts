import * as core from "@actions/core";
import { CocoapodsInstaller } from "./installer";

const run = async (): Promise<void> => {
    try {
        if (process.platform !== "darwin") {
            throw new Error(`This task is intended only for macOS platform. It can't be run on '${process.platform}' platform`);
        }

        const versionInput = core.getInput("version", { required: false });
        const podfilePathInput = core.getInput("podfile-path", { required: false });

        if (!!versionInput === !!podfilePathInput) {
            throw new Error("Invalid input parameters. Only 'version' or 'podfile-path' should be defined")
        }

        const versionSpec = versionInput || CocoapodsInstaller.getVersionFromPodfile(podfilePathInput);
        if (!versionSpec) {
            throw new Error(`Invalid version format '${versionSpec}'`);
        }

        await CocoapodsInstaller.install(versionSpec);
    } catch (error) {
        core.setFailed(error.message);
    }
};

run();
